import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart } from '../../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartsService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }
  
  addItemToCart(productId: number, quantity: number, variantId?: number): Observable<any> {
    const request = {
      productId,
      quantity,
      variantId: variantId || null // Send null if no variant
    };
  
    return this.http.post<any>(`${this.apiUrl}/api/Carts/items`, request).pipe(
      tap(response => {
        if (response.success) {
          console.log('Item added successfully:', response.data);
        }
      }),
      catchError(error => {
        console.error('Error adding item to cart:', error);
        throw error; 
      })
    );
  }
   // Get the user's cart
   getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/api/Carts`);
  }

  // Add a new item to the cart
  addCartItem(cartItem: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Carts/items`, cartItem);
  }

  // Update an item in the cart
  updateCartItem(cartItemId: number, cartItem: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/Carts/items/${cartItemId}`, cartItem);
  }

  // Remove an item from the cart
  removeCartItem(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/Carts/items/${cartItemId}`);
  }

  // Clear the entire cart
  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/Carts/clear`);
  }

// Get the total number of items in cart
  getCartItemCount(): Observable<number> {
    return this.getCart().pipe(
      map((cart: any) => {
        if (cart && cart.data && cart.data.cartItems) {
          return cart.data.cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
        } else if (cart && cart.cartItems) {
          return cart.cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
        }
        return 0;
      })
    );
  }

  //Calculate the total price of items in cart
  getCartTotal(): Observable<number> {
    return this.getCart().pipe(
      map((cart: any) => {
        if (cart && cart.data && cart.data.cartItems) {
          return cart.data.cartItems.reduce((sum: number, item: any) => sum + (item.discountedPrice * item.quantity), 0);
        } else if (cart && cart.cartItems) {
          return cart.cartItems.reduce((sum: number, item: any) => sum + (item.discountedPrice * item.quantity), 0);
        }
        return 0;
      })
    );
  }

//Check if a product is already in the cart
checkItemInCart(productId: number, variantId?: number): Observable<boolean> {
  return this.getCart().pipe(
    map((cart: any) => {
      const items = cart?.data?.cartItems || cart?.cartItems || [];
      return items.some((item: any) => 
        item.productId === productId && 
        (!variantId || item.variantId === variantId)
      );
    })
  );
}

}