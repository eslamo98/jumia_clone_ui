// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { catchError, delay, map, Observable, of, tap } from 'rxjs';
// import { environment } from '../../environments/environment';
// import { Cart, CartResponse } from '../../models/cart';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartsService {
//   private apiUrl = `${environment.apiUrl}/api/Carts`;
  
//   constructor(private http: HttpClient) { }
  
//   addItemToCart(productId: number, quantity: number, variantId?: number): Observable<any> {
//     const request = {
//       productId,
//       quantity,
//       variantId: variantId || null // Send null if no variant
//     };
  
//     return this.http.post<any>(`${this.apiUrl}/items`, request).pipe(
//       tap(response => {
//         if (response.success) {
//           console.log('Item added successfully:', response.data);
//         }
//       }),
//       catchError(error => {
//         console.error('Error adding item to cart:', error);
//         throw error; 
//       })
//     );
//   }
//    // Get the user's cart
//    getCart(): Observable<Cart> {
//     return this.http.get<Cart>(`${this.apiUrl}/api/Carts`);
   
//    }

//   // Get cart items
//   getCartItems(): Observable<CartResponse> {
//     return this.http.get<CartResponse>(`${this.apiUrl}/items`);
//   }

//   // Add a new item to the cart
//   addCartItem(cartItem: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/api/Carts/items`, cartItem);
//   }

//   // Update an item in the cart
//   updateCartItem(cartItemId: number, cartItem: any): Observable<any> {
//     return this.http.put(`${this.apiUrl}/api/Carts/items/${cartItemId}`, cartItem);
//   }

//   // Remove an item from the cart
//   removeCartItem(cartItemId: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/api/Carts/items/${cartItemId}`);
//   }

//   // Clear the entire cart
//   clearCart(): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/api/Carts/clear`);
//   }

// // Get the total number of items in cart
//   getCartItemCount(): Observable<number> {
//     return this.getCart().pipe(
//       map((cart: any) => {
//         if (cart && cart.data && cart.data.cartItems) {
//           return cart.data.cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
//         } else if (cart && cart.cartItems) {
//           return cart.cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
//         }
//         return 0;
//       })
//     );
//   }

//   //Calculate the total price of items in cart
//   getCartTotal(): Observable<number> {
//     return this.getCart().pipe(
//       map((cart: any) => {
//         if (cart && cart.data && cart.data.cartItems) {
//           return cart.data.cartItems.reduce((sum: number, item: any) => sum + (item.discountedPrice * item.quantity), 0);
//         } else if (cart && cart.cartItems) {
//           return cart.cartItems.reduce((sum: number, item: any) => sum + (item.discountedPrice * item.quantity), 0);
//         }
//         return 0;
//       })
//     );
//   }

// //Check if a product is already in the cart
// checkItemInCart(productId: number, variantId?: number): Observable<boolean> {
//   return this.getCart().pipe(
//     map((cart: any) => {
//       const items = cart?.data?.cartItems || cart?.cartItems || [];
//       return items.some((item: any) => 
//         item.productId === productId && 
//         (!variantId || item.variantId === variantId)
//       );
//     })
//   );
// }

// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
// import { Cart } from '../../models/cart';
import { Cart } from '../../models/cart.model';
import { CartSummary } from '../../models/cart-summary.model';
import { CartItem } from '../../models/cart-item.model';
import { AddCartItem } from '../../models/add-cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartsService {
  private apiUrl = `${environment.apiUrl}/api/Carts`;
  
  constructor(private http: HttpClient) { }
  
 // Get the user's cart
getCart(): Observable<Cart> {
  return this.http.get<any>(`${this.apiUrl}`).pipe(
    map(response => {
      // Check if response has the wrapper structure
      if (response && response.success && response.data) {
        return response.data; // Return the actual cart data
      }
      // If the API returns the cart directly (unlikely based on screenshot)
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
      catchError(error => {
        console.error('Error adding item to cart:', error);
        return throwError(() => error);
      })
    );
  }

  // Update an item in the cart
  updateCartItem(cartItemId: number, quantity: number): Observable<any> {
    // Fix: Create a proper object for the request body with both cartItemId and quantity
    const updateData = {
      cartItemId: cartItemId,
      quantity: quantity
    };
    
    return this.http.put(`${this.apiUrl}/items/${cartItemId}`, updateData).pipe(
      catchError(error => {
        console.error('Error updating cart item:', error);
        return throwError(() => error);
      })
    );
  }

  // Remove an item from the cart
  removeCartItem(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${cartItemId}`).pipe(
      catchError(error => {
        console.error('Error removing cart item:', error);
        return throwError(() => error);
      })
    );
  }

  // Clear the entire cart
  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`).pipe(
      catchError(error => {
        console.error('Error clearing cart:', error);
        return throwError(() => error);
      })
    );
  }

  // Get the total number of items in cart
  getCartItemCount(): Observable<number> {
    return this.getCart().pipe(
      map((cart: Cart) => {
        if (cart && cart.cartItems) {
          return cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
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
          // return cart.cartItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
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