import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartItem } from '../../../models/cart-item.model';
import { CartItemComponent } from './cart-item/components/cart-item/cart-item.component';
import { CartSummaryComponent } from './cart-summary/components/cart-summary/cart-summary.component';
import { CartsService } from '../../../services/cart/carts.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, Subscription } from 'rxjs';
import { Cart } from '../../../models/cart.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, CartItemComponent, CartSummaryComponent ,RouterModule],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  isLoading: boolean = false;
  isProcessing: boolean = false; // For tracking item updates/removals
  error: string | null = null;
  totalAmount: number = 0;
  itemCount: number = 0;
  hasExpressItems: boolean = false;
  private cartCountSubscription: Subscription | null = null;

  constructor(
    private cartService: CartsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
    
    // Subscribe to cart count changes with debounce to avoid excessive calls
    this.cartCountSubscription = this.cartService.cartItemCount$
      .pipe(
        debounceTime(300), // Wait 300ms after the last emission
        distinctUntilChanged() // Only proceed if the value is different
      )
      .subscribe(count => {
        // Only refresh cart if the count changes and we're not already loading
        if (count !== this.itemCount && !this.isLoading && !this.isProcessing) {
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
    // Prevent duplicate calls if already loading
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.error = null;
    
    this.cartService.getCart().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (cart: Cart) => {
        if (cart && cart.cartItems) {
          // Map API response to expected CartItem format with proper error handling
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
              originalPrice: item.originalPrice || null,
              percentOff: item.percentOff || null,
              isJumiaExpress: item.productId % 3 === 0,
              maxQuantity: item.maxQuantity || 10,
              attributes: attributes,
              quantity: item.quantity || 1 // Ensure quantity has a default
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
        this.cartItems = [];
        this.totalAmount = 0;
        this.itemCount = 0;
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
    
    // Skip update if quantity hasn't changed
    if (quantity === item.quantity) {
      return;
    }
    
    // Optimistically update the UI for better UX
    const originalQuantity = this.cartItems[itemIndex].quantity;
    this.cartItems[itemIndex].quantity = quantity;
    this.calculateCartTotals();
    
    // Set processing flag to prevent cartCount subscription from reloading during operation
    this.isProcessing = true;
    
    // Then update on the server
    this.cartService.updateCartItem(itemId, quantity).pipe(
      finalize(() => this.isProcessing = false),
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
    if (itemIndex === -1) return;
    
    const removedItem = this.cartItems[itemIndex];
    this.cartItems.splice(itemIndex, 1);
    this.calculateCartTotals();
    this.checkForExpressItems();
    
    // Set processing flag to prevent cartCount subscription from reloading during operation
    this.isProcessing = true;

    // Then remove from server
    this.cartService.removeCartItem(itemId).pipe(
      finalize(() => this.isProcessing = false),
      catchError(err => {
        console.error('Error removing item:', err);
        this.error = 'Failed to remove item from cart. Please try again.';
        // If error, add the item back
        this.cartItems.splice(itemIndex, 0, removedItem);
        this.calculateCartTotals();
        this.checkForExpressItems();
        return of(null);
      })
    ).subscribe();
  }

  clearCart() {
    if (this.cartItems.length === 0) return;
    
    // Optimistically clear UI
    const originalItems = [...this.cartItems];
    this.cartItems = [];
    this.totalAmount = 0;
    this.itemCount = 0;
    this.hasExpressItems = false;
    
    // Set processing flag to prevent cartCount subscription from reloading during operation
    this.isProcessing = true;
    
    this.cartService.clearCart().pipe(
      finalize(() => this.isProcessing = false),
      catchError(err => {
        console.error('Error clearing cart:', err);
        this.error = 'Failed to clear your cart. Please try again.';
        // Restore the cart items if failed
        this.cartItems = originalItems;
        this.calculateCartTotals();
        this.checkForExpressItems();
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
    if (this.cartItems.length === 0) {
      this.error = 'Your cart is empty. Please add items before checkout.';
      return;
    }
    
    console.log('Proceeding to checkout with total amount:', this.totalAmount);
    this.router.navigate(['/checkout']);
  }
}