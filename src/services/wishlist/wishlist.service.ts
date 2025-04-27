import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

export interface WishlistItem {
  productId: number;
  name: string;
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  mainImageUrl: string;
  isAvailable: boolean;
}

export interface WishlistSummary {
  totalItems: number;
  items: WishlistItem[];
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/api/wishlists`;
  private wishlistItemsSubject = new BehaviorSubject<number[]>([]);
  wishlistItems$ = this.wishlistItemsSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.loadWishlistFromStorage();
  }

  private loadWishlistFromStorage(): void {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        this.wishlistItemsSubject.next(parsedWishlist);
      }
    } catch (error) {
      console.error('Error loading wishlist from storage', error);
      this.wishlistItemsSubject.next([]);
    }
  }

  private saveWishlistToStorage(wishlistItems: number[]): void {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }

  // Get all wishlist items
  getWishlist(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Get wishlist summary
  getWishlistSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary`);
  }

  // Add item to wishlist
  addToWishlist(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, { productId }).pipe(
      tap(() => {
        const currentItems = this.wishlistItemsSubject.value;
        if (!currentItems.includes(productId)) {
          const updatedItems = [...currentItems, productId];
          this.wishlistItemsSubject.next(updatedItems);
          this.saveWishlistToStorage(updatedItems);
        }
      })
    );
  }

  // Remove item from wishlist
  removeFromWishlist(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${productId}`).pipe(
      tap(() => {
        const currentItems = this.wishlistItemsSubject.value;
        const updatedItems = currentItems.filter(id => id !== productId);
        this.wishlistItemsSubject.next(updatedItems);
        this.saveWishlistToStorage(updatedItems);
      })
    );
  }

  // Toggle item in wishlist
  toggleWishlistItem(productId: number): Observable<any> {
    const currentItems = this.wishlistItemsSubject.value;
    if (currentItems.includes(productId)) {
      return this.removeFromWishlist(productId);
    } else {
      return this.addToWishlist(productId);
    }
  }

  // Move item from wishlist to cart
  moveToCart(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/move-to-cart/${productId}`, {}).pipe(
      tap(() => {
        // Remove from wishlist after moving to cart
        const currentItems = this.wishlistItemsSubject.value;
        const updatedItems = currentItems.filter(id => id !== productId);
        this.wishlistItemsSubject.next(updatedItems);
        this.saveWishlistToStorage(updatedItems);
      })
    );
  }

  // Clear wishlist
  clearWishlist(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`).pipe(
      tap(() => {
        this.wishlistItemsSubject.next([]);
        this.saveWishlistToStorage([]);
      })
    );
  }

  // Check if item is in wishlist
  isInWishlist(productId: number): boolean {
    return this.wishlistItemsSubject.value.includes(productId);
  }

  // Get wishlist item count
  getWishlistCount(): number {
    return this.wishlistItemsSubject.value.length;
  }
}