import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { CartsService } from '../cart/carts.service';

export interface CreateOrderRequest {
  customerId: number;
  addressId: number;
  couponId?: number | null;
  paymentMethod: string;
  affiliateId?: number | null;
  affiliateCode?: string | null;
  orderItems: OrderItem[];
}

export interface OrderItem {
  productId: number;
  quantity: number;
  variantId?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = `${environment.apiUrl}/api/Orders`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cartService: CartsService
  ) {}

  completeOrder(addressId: number, couponId?: number, paymentMethod: string = 'CreditCard'): Observable<any> {
    // Get the customer ID from the auth service
    const userData = this.authService.currentUserValue;
    if (!userData || userData.userType !== 'Customer') {
      throw new Error('User must be logged in as a customer to place an order');
    }

    // Get cart items and transform them into order items
    return this.cartService.getCartItems().pipe(
      map(cartItems => {
        const orderRequest: CreateOrderRequest = {
          customerId: userData.entityId, // Use entityId as customerId for customer users
          addressId: addressId,
          couponId: couponId || null,
          paymentMethod: paymentMethod,
          affiliateId: null,
          affiliateCode: null,
          orderItems: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            variantId: item.variantId || null
          }))
        };
        return orderRequest;
      }),
      switchMap(orderRequest => {
        return this.http.post<any>(`${this.apiUrl}`, orderRequest);
      })
    );
  }
}