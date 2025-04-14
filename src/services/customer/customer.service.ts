import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  ApiResponse, 
  UserProfile, 
  UpdateUserProfile, 
  ChangePassword, 
  Order, 
  Address,
  CreateAddressInput,
  UpdateAddressInput,
  PaginatedResponse,
  WishlistItem
} from '../../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/users/customers/${userId}`);
  }

  updateProfile(userId: number, data: UpdateUserProfile): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.apiUrl}/users/customers/${userId}`, data);
  }

  changePassword(userId: number, data: ChangePassword): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.apiUrl}/users/${userId}/change-password`, data);
  }

  getOrders(): Observable<ApiResponse<PaginatedResponse<Order>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Order>>>(`${this.apiUrl}/orders`);
  }

  // Address-related methods
  getAddresses(userId: number, pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<PaginatedResponse<Address>>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Address>>>(`${this.apiUrl}/addresses/customer/${userId}`, { params });
  }

  getAddress(id: number): Observable<ApiResponse<Address>> {
    return this.http.get<ApiResponse<Address>>(`${this.apiUrl}/addresses/${id}`);
  }

  createAddress(address: CreateAddressInput): Observable<ApiResponse<Address>> {
    return this.http.post<ApiResponse<Address>>(`${this.apiUrl}/addresses`, address);
  }

  updateAddress(id: number, address: UpdateAddressInput): Observable<ApiResponse<Address>> {
    return this.http.put<ApiResponse<Address>>(`${this.apiUrl}/addresses/${id}`, address);
  }

  deleteAddress(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/addresses/${id}`);
  }

  // Wishlist methods
  getWishlist(userId: number, pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<PaginatedResponse<WishlistItem>>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResponse<WishlistItem>>>(`${this.apiUrl}/wishlist/customer/${userId}`, { params });
  }

  addToWishlist(userId: number, productId: number): Observable<ApiResponse<WishlistItem>> {
    return this.http.post<ApiResponse<WishlistItem>>(`${this.apiUrl}/wishlist`, { userId, productId });
  }

  removeFromWishlist(wishlistId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/wishlist/${wishlistId}`);
  }

  moveToCart(wishlistId: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/wishlist/${wishlistId}/move-to-cart`, {});
  }
}