import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../models/cart-item.model';
import { CartItemComponent } from './cart-item/components/cart-item/cart-item.component';
import { CartSummaryComponent } from './cart-summary/components/cart-summary/cart-summary.component';
import { CartsService } from '../../../services/cart/carts.service';
import { catchError, finalize, of, Subscription } from 'rxjs';
import { Cart } from '../../../models/cart.model';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, CartItemComponent, CartSummaryComponent],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  totalAmount: number = 0;
  itemCount: number = 0;
  hasExpressItems: boolean = false;
  private cartCountSubscription: Subscription | null = null;

  constructor(private cartService: CartsService) {}

  ngOnInit() {
    this.loadCart();
    
    // Subscribe to cart count changes
    this.cartCountSubscription = this.cartService.cartItemCount$.subscribe(count => {
      // If the count changes from outside this component, refresh the cart
      if (count !== this.itemCount && !this.isLoading) {
        this.loadCart();
      }
    });
  }

  ngOnDestroy() {
    if (this.cartCountSubscription) {
      this.cartCountSubscription.unsubscribe();
    }
  }

  loadCart() {
    this.isLoading = true;
    this.cartService.getCart().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (cart: Cart) => {
        if (cart && cart.cartItems) {
          // Map API response to expected CartItem format
          this.cartItems = cart.cartItems.map(item => {
            // Create the attributes object properly
            const attributes: {[key: string]: string} = {};
            if (item.variantName) {
              attributes['Variant'] = item.variantName;
            }
            
            // Transform image URL by adding base URL if it's a relative path
            let imageUrl = item.productImage || '';
            if (imageUrl && !imageUrl.startsWith('http')) {
              imageUrl = `${environment.apiUrl}/${imageUrl}`;
            }
            
            return {
              ...item,
              name: item.productName || '',
              imageUrl: imageUrl,
              productImage: imageUrl, // Update this property too
              discountedPrice: item.priceAtAddition || 0,
              originalPrice: null,
              percentOff: null,
              isJumiaExpress: item.productId % 3 === 0,
              maxQuantity: 10,
              attributes: attributes
            };
          });
          this.calculateCartTotals();
          this.checkForExpressItems();
        } else {
          this.cartItems = [];
          this.totalAmount = 0;
          this.itemCount = 0;
          this.hasExpressItems = false;
        }
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.error = 'Failed to load your cart. Please try again.';
      },
    });
  }

  calculateCartTotals() {
    // Calculate total price - ensure we're using consistent properties
    this.totalAmount = this.cartItems.reduce(
      (sum, item) => sum + ((item.discountedPrice || 0) * (item.quantity || 1)), 
      0
    );
    
    // Calculate total quantity of items
    this.itemCount = this.cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1), 
      0
    );
  }

  checkForExpressItems() {
    this.hasExpressItems = this.cartItems.some(item => item.isJumiaExpress);
  }

  updateItemQuantity(itemId: number, quantity: number) {
    console.log(`Updating item ${itemId} to quantity ${quantity}`);
    
    // Find the item in the cart
    const itemIndex = this.cartItems.findIndex(item => item.cartItemId === itemId);
    
    if (itemIndex === -1) {
      console.error(`Item with ID ${itemId} not found in cart`);
      return;
    }
    
    const item = this.cartItems[itemIndex];
    const maxQty = item.maxQuantity || 10;
    
    // Validate quantity against constraints
    if (quantity < 1) {
      quantity = 1;
      console.log(`Quantity adjusted to minimum (1)`);
    } else if (quantity > maxQty) {
      quantity = maxQty;
      console.log(`Quantity adjusted to maximum (${maxQty})`);
    }
    
    // Optimistically update the UI for better UX
    const originalQuantity = this.cartItems[itemIndex].quantity;
    this.cartItems[itemIndex].quantity = quantity;
    this.calculateCartTotals();
    
    // Then update on the server
    this.isLoading = true;
    this.cartService.updateCartItem(itemId, quantity).pipe(
      finalize(() => this.isLoading = false),
      catchError(err => {
        console.error('Error updating item quantity:', err);
        this.error = 'Failed to update item quantity. Please try again.';
        // Revert the local change since the server update failed
        this.cartItems[itemIndex].quantity = originalQuantity;
        this.calculateCartTotals();
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        console.log(`Quantity updated successfully to ${quantity}`);
      }
    });
  }

  removeItem(itemId: number) {
    // Optimistically remove the item from the UI first for better UX
    const itemIndex = this.cartItems.findIndex(item => item.cartItemId === itemId);
    if (itemIndex !== -1) {
      const removedItem = this.cartItems[itemIndex];
      this.cartItems.splice(itemIndex, 1);
      this.calculateCartTotals();
      this.checkForExpressItems();
    }

    // Then remove from server
    this.isLoading = true;
    this.cartService.removeCartItem(itemId).pipe(
      finalize(() => this.isLoading = false),
      catchError(err => {
        console.error('Error removing item:', err);
        this.error = 'Failed to remove item from cart. Please try again.';
        // If error, reload the entire cart to sync with server
        this.loadCart();
        return of(null);
      })
    ).subscribe();
  }

  clearCart() {
    if (this.cartItems.length === 0) return;
    
    // Optimistically clear UI
    this.cartItems = [];
    this.totalAmount = 0;
    this.itemCount = 0;
    this.hasExpressItems = false;
    
    this.isLoading = true;
    this.cartService.clearCart().pipe(
      finalize(() => this.isLoading = false),
      catchError(err => {
        console.error('Error clearing cart:', err);
        this.error = 'Failed to clear your cart. Please try again.';
        // If error, reload the cart to sync with server
        this.loadCart();
        return of(null);
      })
    ).subscribe();
  }

  getCartItemCount(): number {
    return this.itemCount;
  }

  getTotalPrice(): number {
    return this.totalAmount;
  }

  hasJumiaExpressItems(): boolean {
    return this.hasExpressItems;
  }

  // Method to refresh the cart
  refreshCart() {
    this.loadCart();
  }

  // Method to handle checkout
  checkout() {
    // You can add navigation logic here
    console.log('Proceeding to checkout with total amount:', this.totalAmount);
    // This would typically navigate to a checkout page
    // For example: this.router.navigate(['/checkout']);
  }
}