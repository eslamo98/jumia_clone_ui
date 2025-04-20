import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
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
    return this.http.get<Cart>(`${this.apiUrl}`);
  }

  // Add a new item to the cart
  addCartItem(cartItem: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, cartItem);
  }

  // Update an item in the cart
  updateCartItem(cartItemId: number, cartItem: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/items/${cartItemId}`, cartItem);
  }

  // Remove an item from the cart
  removeCartItem(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${cartItemId}`);
  }

  // Clear the entire cart
  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`);
  }
}