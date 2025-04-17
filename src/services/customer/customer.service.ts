import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  UserProfile,
  UpdateUserProfile,
  ChangePassword,
  Address,
  CreateAddressInput,
  UpdateAddressInput,
  ApiResponse,
  PaginatedResponse,
  Order,
  WishlistItem,
  NewsletterPreferences,
  RecentlyViewedProduct,
  FollowedSeller
} from '../../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  // Profile Methods
  getProfile(userId: number): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/users/customers/${userId}`);
  }

  updateProfile(userId: number, data: UpdateUserProfile): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.apiUrl}/users/customers/${userId}`, data);
  }

  changePassword(userId: number, data: ChangePassword): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.apiUrl}/users/customers/${userId}/change-password`, data);
  }

  // Orders Methods
  getOrders(page: number = 1, pageSize: number = 10): Observable<ApiResponse<PaginatedResponse<Order>>> {
    const params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Order>>>(`${this.apiUrl}/orders`, { params });
  }

  // Address Methods
  getAddresses(userId: number, page: number = 1, pageSize: number = 10): Observable<ApiResponse<PaginatedResponse<Address>>> {
    const params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Address>>>(`${this.apiUrl}/addresses/customer/${userId}`, { params });
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

  // Wishlist Methods
  getWishlist(userId: number, page: number = 1, pageSize: number = 10): Observable<ApiResponse<PaginatedResponse<WishlistItem>>> {
    const params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PaginatedResponse<WishlistItem>>>(`${this.apiUrl}/wishlist/customer/${userId}`, { params });
  }

  moveToCart(wishlistId: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/wishlist/${wishlistId}/move-to-cart`, {});
  }

  removeFromWishlist(wishlistId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/wishlist/${wishlistId}`);
  }

  // Newsletter Preferences
  getNewsletterPreferences(): Observable<ApiResponse<NewsletterPreferences>> {
    return this.http.get<ApiResponse<NewsletterPreferences>>(`${this.apiUrl}/users/preferences/newsletter`);
  }

  updateNewsletterPreferences(preferences: Partial<NewsletterPreferences>): Observable<ApiResponse<NewsletterPreferences>> {
    return this.http.put<ApiResponse<NewsletterPreferences>>(`${this.apiUrl}/users/preferences/newsletter`, preferences);
  }

  // Account Closure
  closeAccount(userId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/users/${userId}`);
  }

  // Vouchers
  getVouchers(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/coupons/user`);
  }

  // Recently Viewed and Followed Sellers
  getRecentlyViewed(): Observable<ApiResponse<RecentlyViewedProduct[]>> {
    return this.http.get<ApiResponse<RecentlyViewedProduct[]>>(
      `${this.apiUrl}/products/recently-viewed?userId=${this.getCurrentUserId()}`
    );
  }

  getFollowedSellers(): Observable<ApiResponse<FollowedSeller[]>> {
    return this.http.get<ApiResponse<FollowedSeller[]>>(
      `${this.apiUrl}/sellers/followed?userId=${this.getCurrentUserId()}`
    );
  }

  unfollowSeller(sellerId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/sellers/${sellerId}/follow`
    );
  }

  // Utility method to get the current user ID
  private getCurrentUserId(): number {
    // Replace this with the actual logic to retrieve the current user ID
    return 1; // Example: returning a hardcoded user ID
  }

  // Mock methods for features without backend endpoints yet
  private simulateAsyncResponse<T>(data: T, delay: number = 500): Observable<ApiResponse<T>> {
    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next({
          success: true,
          message: 'Operation successful',
          data
        });
        subscriber.complete();
      }, delay);
    });
  }

  getMockInboxMessages(): Observable<ApiResponse<PaginatedResponse<any>>> {
    const mockMessages = {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false
    };
    return this.simulateAsyncResponse(mockMessages);
  }

  getMockPendingReviews(): Observable<ApiResponse<PaginatedResponse<any>>> {
    const mockReviews = {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false
    };
    return this.simulateAsyncResponse(mockReviews);
  }
}