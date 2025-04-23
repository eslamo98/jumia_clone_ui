import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../models/cart-item.model';
import { CartItemComponent } from './cart-item/components/cart-item/cart-item.component';
import { CartSummaryComponent } from './cart-summary/components/cart-summary/cart-summary.component';
import { CartsService } from '../../../services/cart/carts.service';
import { catchError, finalize, of } from 'rxjs';
import { Cart } from '../../../models/cart.model';
import { CartSummary } from '../../../models/cart-summary.model';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, CartItemComponent, CartSummaryComponent],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  totalAmount: number = 0;
  itemCount: number = 0;
  hasExpressItems: boolean = false;

  constructor(private cartService: CartsService) {}

  ngOnInit() {
    this.loadCart();
  }

  // loadCart() {
  //   this.isLoading = true;
  //   this.cartService.getCart().pipe(
  //     finalize(() => this.isLoading = false)
  //   ).subscribe({
  //     next: (cart: Cart) => {
  //       if (cart && cart.cartItems) {
  //         this.cartItems = cart.cartItems;
  //         this.calculateCartTotals();
  //         this.checkForExpressItems();
  //       } else {
  //         this.cartItems = [];
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error loading cart:', err);
  //       this.error = 'Failed to load your cart. Please try again.';
  //     },
  //   });
  // }
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
        }
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.error = 'Failed to load your cart. Please try again.';
      },
    });
  }

  // calculateCartTotals() {
  //   this.totalAmount = this.cartItems.reduce(
  //     (sum, item) => sum + (item.discountedPrice * item.quantity), 
  //     0
  //   );
    
  //   this.itemCount = this.cartItems.reduce(
  //     (sum, item) => sum + item.quantity, 
  //     0
  //   );
  // }

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
    
    // Update locally first for immediate feedback
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
        this.loadCart(); // Reload to get the original state
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        console.log(`Quantity updated successfully to ${quantity}`);
      }
    });
  }


  removeItem(itemId: number) {
    // Show a loading state
    this.isLoading = true;

    // First update UI for immediate feedback
    this.cartItems = this.cartItems.filter(item => item.cartItemId !== itemId);
    this.calculateCartTotals();
    this.checkForExpressItems();

    // Then remove from server
    this.cartService.removeCartItem(itemId).pipe(
      finalize(() => this.isLoading = false),
      catchError(err => {
        console.error('Error removing item:', err);
        this.error = 'Failed to remove item from cart. Please try again.';
        // Reload cart since the operation failed
        this.loadCart();
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        console.log(`Item ${itemId} removed successfully`);
      }
    });
  }


   clearCart() {
    if (this.cartItems.length === 0) return;
    
    this.isLoading = true;
    this.cartService.clearCart().pipe(
      finalize(() => this.isLoading = false),
      catchError(err => {
        console.error('Error clearing cart:', err);
        this.error = 'Failed to clear your cart. Please try again.';
        return of(null);
      })
    ).subscribe(response => {
      if (response !== null) {
        this.cartItems = [];
        this.totalAmount = 0;
        this.itemCount = 0;
        this.hasExpressItems = false;
      }
    });
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