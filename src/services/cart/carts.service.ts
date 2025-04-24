import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart } from '../../models/cart.model';
import { CartSummary } from '../../models/cart-summary.model';
import { CartItem } from '../../models/cart-item.model';
import { AddCartItem } from '../../models/add-cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartsService {
  private apiUrl = `${environment.apiUrl}/api/Carts`;
  
  // Add a BehaviorSubject to track the cart item count
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();
  
  constructor(private http: HttpClient) {
    // Initialize the cart count if the user is logged in
    this.refreshCartCount();
  }
  
  // Method to refresh the cart count
  refreshCartCount(): void {
    // Only proceed if we have a token (user is logged in)
    if (localStorage.getItem('token')) {
      this.getCart().subscribe({
        next: (cart: Cart) => {
          if (cart && cart.cartItems) {
            const count = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            this.cartItemCountSubject.next(count);
          } else {
            this.cartItemCountSubject.next(0);
          }
        },
        error: () => {
          this.cartItemCountSubject.next(0);
        }
      });
    } else {
      this.cartItemCountSubject.next(0);
    }
  }
  
  // Get the user's cart
  getCart(): Observable<Cart> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map(response => {
        // Check if response has the wrapper structure
        if (response && response.success && response.data) {
          return response.data; // Return the actual cart data
        }
        // If the API returns the cart directly
        return response;
      }),
      catchError(error => {
        console.error('Error fetching cart:', error);
        return throwError(() => error);
      })
    );
  }

  // Get cart summary (count, total, etc.)
  getCartSummary(): Observable<CartSummary> {
    return this.http.get<CartSummary>(`${this.apiUrl}/summary`).pipe(
      catchError(error => {
        console.error('Error fetching cart summary:', error);
        return throwError(() => error);
      })
    );
  }

  // Get cart items
  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/items`).pipe(
      catchError(error => {
        console.error('Error fetching cart items:', error);
        return throwError(() => error);
      })
    );
  }

  // Add a new item to the cart
  addItemToCart(productId: number, quantity: number, variantId?: number): Observable<any> {
    const cartItem: AddCartItem = {
      productId,
      quantity,
      variantId: variantId || undefined
    };
  
    return this.http.post<any>(`${this.apiUrl}/items`, cartItem).pipe(
      map(response => {
        this.refreshCartCount(); // Update cart count after adding item
        return response;
      }),
      catchError(error => {
        console.error('Error adding item to cart:', error);
        return throwError(() => error);
      })
    );
  }

  // Update an item in the cart
  updateCartItem(cartItemId: number, quantity: number): Observable<any> {
    // Create a proper object for the request body with both cartItemId and quantity
    const updateData = {
      cartItemId: cartItemId,
      quantity: quantity
    };
    
    return this.http.put(`${this.apiUrl}/items/${cartItemId}`, updateData).pipe(
      map(response => {
        this.refreshCartCount(); // Update cart count after modifying item
        return response;
      }),
      catchError(error => {
        console.error('Error updating cart item:', error);
        return throwError(() => error);
      })
    );
  }

  // Remove an item from the cart
  removeCartItem(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${cartItemId}`).pipe(
      map(response => {
        this.refreshCartCount(); // Update cart count after removing item
        return response;
      }),
      catchError(error => {
        console.error('Error removing cart item:', error);
        return throwError(() => error);
      })
    );
  }

  // Clear the entire cart
  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`).pipe(
      map(response => {
        this.cartItemCountSubject.next(0); // Reset cart count to zero
        return response;
      }),
      catchError(error => {
        console.error('Error clearing cart:', error);
        return throwError(() => error);
      })
    );
  }

  // Get the total number of items in cart
  getCartItemCount(): Observable<number> {
    // First try to use the cached count
    if (this.cartItemCountSubject.value > 0) {
      return this.cartItemCount$;
    }
    
    // If no cached count, fetch from API
    return this.getCart().pipe(
      map((cart: Cart) => {
        if (cart && cart.cartItems) {
          const count = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
          // Update the subject with the new count
          this.cartItemCountSubject.next(count);
          return count;
        }
        return 0;
      }),
      catchError(error => {
        console.error('Error calculating cart item count:', error);
        return throwError(() => error);
      })
    );
  }

  // Calculate the total price of items in cart
  getCartTotal(): Observable<number> {
    return this.getCart().pipe(
      map((cart: Cart) => {
        if (cart && cart.cartItems) {
           return cart.cartItems.reduce((sum: number, item: { discountedPrice: number; quantity: number; }) => sum + (item.discountedPrice * item.quantity), 0);
        }
        return 0;
      }),
      catchError(error => {
        console.error('Error calculating cart total:', error);
        return throwError(() => error);
      })
    );
  }

  // Check if a product is already in the cart
  checkItemInCart(productId: number, variantId?: number): Observable<boolean> {
    return this.getCart().pipe(
      map((cart: Cart) => {
        const items = cart?.cartItems || [];
        return items.some(item => 
          item.productId === productId && 
          (!variantId || item.variantId === variantId)
        );
      }),
      catchError(error => {
        console.error('Error checking item in cart:', error);
        return throwError(() => error);
      })
    );
  }
}