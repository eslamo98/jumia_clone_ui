import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService, WishlistItem } from '../../../../services/wishlist/wishlist.service';
import { NotificationService } from '../../../../services/notification/notification.service';
import { CartsService } from '../../../../services/cart/carts.service';
import { environment } from '../../../../environments/environment';
import { Helpers } from '../../../../Utility/helpers';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent extends Helpers implements OnInit {
  wishlistItems: WishlistItem[] = [];
  loading = true;
  error: string | null = null;
  movingToCart: { [productId: number]: boolean } = {};

  constructor(
    private wishlistService: WishlistService,
    private cartsService: CartsService,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadWishlistItems();
  }

  loadWishlistItems(): void {
    this.loading = true;
    this.error = null;

    this.wishlistService.getWishlist().subscribe({
      next: (response: any) => {
        if (response && response.success && response.data && response.data.wishlistItems) {
          this.wishlistItems = response.data.wishlistItems;
          
          // Initialize movingToCart for each item
          this.wishlistItems.forEach(item => {
            this.movingToCart[item.productId] = false;
          });
        } else {
          this.wishlistItems = [];
          this.error = response.message || 'No items in your wishlist';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading wishlist', err);
        this.error = 'Failed to load wishlist. Please try again.';
        this.loading = false;
      }
    });
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.wishlistItems = this.wishlistItems.filter(item => item.productId !== productId);
          this.notificationService.success('Item removed from wishlist');
        } else {
          this.notificationService.error(response.message || 'Failed to remove item from wishlist');
        }
      },
      error: (err) => {
        console.error('Error removing from wishlist', err);
        this.notificationService.error('Failed to remove item from wishlist');
      }
    });
  }

  moveToCart(productId: number): void {
    // If already processing, skip
    if (this.movingToCart[productId]) {
      return;
    }

    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      this.notificationService.warning('Please log in to add items to your cart');
      return;
    }

    // Mark as processing
    this.movingToCart[productId] = true;

    // Move item to cart
    this.wishlistService.moveToCart(productId).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.wishlistItems = this.wishlistItems.filter(item => item.productId !== productId);
          this.notificationService.success('Item moved to cart successfully');
        } else {
          this.notificationService.error(response.message || 'Failed to move item to cart');
        }
        this.movingToCart[productId] = false;
      },
      error: (err) => {
        console.error('Error moving item to cart', err);
        this.notificationService.error('Failed to move item to cart');
        this.movingToCart[productId] = false;
      }
    });
  }

  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      this.wishlistService.clearWishlist().subscribe({
        next: (response) => {
          if (response && response.success) {
            this.wishlistItems = [];
            this.notificationService.success('Wishlist cleared successfully');
          } else {
            this.notificationService.error(response.message || 'Failed to clear wishlist');
          }
        },
        error: (err) => {
          console.error('Error clearing wishlist', err);
          this.notificationService.error('Failed to clear wishlist');
        }
      });
    }
  }
}