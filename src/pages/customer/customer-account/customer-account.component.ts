import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer/customer.service';
import { AuthService } from '../../../services/auth/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ApiResponse, PaginatedResponse, InboxMessage, PendingReview, Order, WishlistItem, Address, UserProfile, NewsletterPreferences, RecentlyViewedProduct, FollowedSeller } from '../../../models/customer';

@Component({
  selector: 'app-customer-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule
  ],
  templateUrl: './customer-account.component.html',
  styleUrls: ['./customer-account.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class CustomerAccountComponent implements OnInit {
  // Assume current user ID; in production, retrieve from AuthService or state management.
  userId: number = 1;

  // Data models
  profile: any;
  orders: any[] = [];
  addresses: any[] = [];
  wishlist: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  loading = { profile: false, password: false, addresses: false };

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  orderCurrentPage: number = 1;
  orderTotalPages: number = 1;
  wishlistCurrentPage: number = 1;
  wishlistTotalPages: number = 1;

  // Forms
  profileForm: FormGroup;
  passwordForm: FormGroup;
  addressForm: FormGroup;

  // Password toggles and strength
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  passwordStrength: number = 0;

  // Section identifiers
  sections = {
    overview: 'overview',
    orders: 'orders',
    inbox: 'inbox',
    pendingReviews: 'pendingReviews',
    vouchers: 'vouchers',
    wishlist: 'wishlist',
    addressBook: 'addressBook',
    newsletter: 'newsletter',
    closeAccount: 'closeAccount'
  };
  activeSection: string = this.sections.overview;

  // Sidebar navigation items with icons and optional counts
  sidebarItems: any[] = [
    { section: this.sections.overview, label: 'Account Overview', icon: 'fas fa-user', count: null },
    { section: this.sections.orders, label: 'Orders', icon: 'fas fa-box', count: 0 },
    { section: this.sections.inbox, label: 'Inbox', icon: 'fas fa-envelope', count: 0 },
    { section: this.sections.pendingReviews, label: 'Pending Reviews', icon: 'fas fa-star', count: 0 },
    { section: this.sections.vouchers, label: 'Vouchers', icon: 'fas fa-ticket-alt', count: 0 },
    { section: this.sections.wishlist, label: 'Wishlist', icon: 'fas fa-heart', count: 0 },
    { section: 'followedSellers', label: 'Followed Sellers', icon: 'fas fa-store', count: 0 },
    { section: 'recentlyViewed', label: 'Recently Viewed', icon: 'fas fa-history', count: 0 },
    { section: this.sections.addressBook, label: 'Address Book', icon: 'fas fa-address-book', count: 0 },
    { section: this.sections.newsletter, label: 'Newsletter Preferences', icon: 'fas fa-envelope-open', count: null },
    { section: this.sections.closeAccount, label: 'Close Account', icon: 'fas fa-user-times', count: null }
  ];

  // Assumed features data (for inbox, pending reviews, vouchers, newsletter preferences)
  assumedFeatures: any = {
    messages: [],
    pendingReviews: [],
    vouchers: [],
    newsletter: { subscribed: false },
    recentlyViewed: [],
    followedSellers: []
  };

  // Mobile menu state
  isMobileMenuOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private authService: AuthService
  ) {
    // Initialize profile form
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });

    // Initialize password form
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    // Initialize address form
    this.addressForm = this.fb.group({
      addressName: ['', Validators.required],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      isDefault: [false]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadOrders();
    this.loadAddresses();
    this.loadWishlist();
    this.loadAssumedFeatures();
  }

  // -------------------------
  // Data Loading Methods
  // -------------------------
  loadProfile() {
    this.loading.profile = true;
    this.customerService.getProfile(this.userId).subscribe({
      next: (response: ApiResponse<UserProfile>) => {
        if (response.success && response.data) {
          this.profile = response.data;
          this.profileForm.patchValue({
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            phoneNumber: this.profile.phoneNumber
          });
        }
        this.loading.profile = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load profile.';
        this.loading.profile = false;
      }
    });
  }

  loadOrders(page: number = 1) {
    this.customerService.getOrders().subscribe({
      next: (response: ApiResponse<PaginatedResponse<Order>>) => {
        if (response.success && response.data) {
          const data = response.data;
          this.orders = data.items;
          this.orderCurrentPage = data.pageNumber;
          this.orderTotalPages = data.totalPages;
          this.updateSidebarCount(this.sections.orders, data.totalCount);
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load orders.';
      }
    });
  }

  loadAddresses(page: number = 1) {
    this.customerService.getAddresses(this.userId, page).subscribe({
      next: (response: ApiResponse<PaginatedResponse<Address>>) => {
        if (response.success && response.data) {
          const data = response.data;
          this.addresses = data.items;
          this.currentPage = data.pageNumber;
          this.totalPages = data.totalPages;
          this.updateSidebarCount(this.sections.addressBook, data.totalCount);
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load addresses.';
      }
    });
  }

  loadWishlist(page: number = 1) {
    this.customerService.getWishlist(this.userId, page).subscribe({
      next: (response: ApiResponse<PaginatedResponse<WishlistItem>>) => {
        if (response.success && response.data) {
          const data = response.data;
          this.wishlist = data.items;
          this.wishlistCurrentPage = data.pageNumber;
          this.wishlistTotalPages = data.totalPages;
          this.updateSidebarCount(this.sections.wishlist, data.totalCount);
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load wishlist.';
      }
    });
  }

  loadAssumedFeatures() {
    // Inbox (using a mock method; replace with real endpoint when available)
    this.customerService.getMockInboxMessages().subscribe({
      next: (response: ApiResponse<PaginatedResponse<InboxMessage>>) => {
        if (response.success && response.data) {
          this.assumedFeatures.messages = response.data.items;
          this.updateSidebarCount(this.sections.inbox, response.data.totalCount);
        }
      },
      error: () => {}
    });

    // Pending Reviews (using a mock method)
    this.customerService.getMockPendingReviews().subscribe({
      next: (response: ApiResponse<PaginatedResponse<PendingReview>>) => {
        if (response.success && response.data) {
          this.assumedFeatures.pendingReviews = response.data.items;
          this.updateSidebarCount(this.sections.pendingReviews, response.data.totalCount);
        }
      },
      error: () => {}
    });

    // Vouchers
    this.customerService.getVouchers().subscribe({
      next: (response: ApiResponse<any[]>) => {
        if (response.success && response.data) {
          this.assumedFeatures.vouchers = response.data;
          this.updateSidebarCount(this.sections.vouchers, response.data.length);
        }
      },
      error: () => {}
    });

    // Newsletter Preferences
    this.customerService.getNewsletterPreferences().subscribe({
      next: (response: ApiResponse<NewsletterPreferences>) => {
        if (response.success && response.data) {
          this.assumedFeatures.newsletter = response.data;
        }
      },
      error: () => {}
    });

    // Recently Viewed
    this.customerService.getRecentlyViewed().subscribe({
      next: (response: ApiResponse<RecentlyViewedProduct[]>) => {
        if (response.success && response.data) {
          this.assumedFeatures.recentlyViewed = response.data;
          this.updateSidebarCount('recentlyViewed', response.data.length);
        }
      },
      error: () => {}
    });

    // Followed Sellers
    this.customerService.getFollowedSellers().subscribe({
      next: (response: ApiResponse<FollowedSeller[]>) => {
        if (response.success && response.data) {
          this.assumedFeatures.followedSellers = response.data;
          this.updateSidebarCount('followedSellers', response.data.length);
        }
      },
      error: () => {}
    });
  }

  // -------------------------
  // Sidebar Helpers
  // -------------------------
  updateSidebarCount(section: string, count: number) {
    const item = this.sidebarItems.find(si => si.section === section);
    if (item) {
      item.count = count;
    }
  }

  switchSection(section: string) {
    this.activeSection = section;
    this.closeMobileMenu();
  }

  getSectionTitle(section: string): string {
    const found = this.sidebarItems.find(si => si.section === section);
    return found ? found.label : '';
  }

  // -------------------------
  // Action Methods
  // -------------------------
  updateProfile() {
    if (this.profileForm.invalid) return;
    this.loading.profile = true;
    this.customerService.updateProfile(this.userId, this.profileForm.value).subscribe({
      next: (response: { success: any; message: string; }) => {
        if (response.success) {
          this.successMessage = 'Profile updated successfully.';
          this.loadProfile();
        } else {
          this.errorMessage = response.message;
        }
        this.loading.profile = false;
      },
      error: () => {
        this.errorMessage = 'Failed to update profile.';
        this.loading.profile = false;
      }
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;
    this.loading.password = true;
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      this.errorMessage = 'New passwords do not match.';
      this.loading.password = false;
      return;
    }
    this.customerService.changePassword(this.userId, this.passwordForm.value).subscribe({
      next: (response: { success: any; message: string; }) => {
        if (response.success) {
          this.successMessage = 'Password changed successfully.';
          this.passwordForm.reset();
        } else {
          this.errorMessage = response.message;
        }
        this.loading.password = false;
      },
      error: () => {
        this.errorMessage = 'Failed to change password.';
        this.loading.password = false;
      }
    });
  }

  togglePassword(field: 'current' | 'new' | 'confirm') {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  getPasswordStrengthColor(): string {
    if (this.passwordStrength > 80) return 'green';
    if (this.passwordStrength > 50) return 'orange';
    return 'red';
  }

  getPasswordStrengthLabel(): string {
    if (this.passwordStrength > 80) return 'Strong';
    if (this.passwordStrength > 50) return 'Medium';
    return 'Weak';
  }

  getPasswordFeedback(): string[] {
    const feedback = [];
    if (this.passwordForm.get('newPassword')?.value.length < 6) {
      feedback.push('Password should be at least 6 characters.');
    }
    // Additional criteria can be added here
    return feedback;
  }

  viewOrderDetails(orderId: number) {
    // Implement navigation to a detailed order view or modal here
  }

  trackOrder(orderId: number) {
    // Implement order tracking logic here
  }

  moveToCart(wishlistId: number) {
    this.customerService.moveToCart(wishlistId).subscribe({
      next: (response: { success: any; message: string; }) => {
        if (response.success) {
          this.successMessage = 'Item moved to cart.';
          this.loadWishlist();
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to move item to cart.';
      }
    });
  }

  removeFromWishlist(wishlistId: number) {
    this.customerService.removeFromWishlist(wishlistId).subscribe({
      next: (response: { success: any; message: string; }) => {
        if (response.success) {
          this.successMessage = 'Item removed from wishlist.';
          this.loadWishlist();
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to remove item from wishlist.';
      }
    });
  }

  changeOrderPage(page: number) {
    if (page < 1 || page > this.orderTotalPages) return;
    this.loadOrders(page);
  }

  changeWishlistPage(page: number) {
    if (page < 1 || page > this.wishlistTotalPages) return;
    this.loadWishlist(page);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadAddresses(page);
  }

  addAddress() {
    if (this.addressForm.invalid) return;
    this.loading.addresses = true;
    this.customerService.createAddress({ userId: this.userId, ...this.addressForm.value }).subscribe({
      next: (response: { success: any; message: string; }) => {
        if (response.success) {
          this.successMessage = 'Address added successfully.';
          this.addressForm.reset();
          this.loadAddresses();
        } else {
          this.errorMessage = response.message;
        }
        this.loading.addresses = false;
      },
      error: () => {
        this.errorMessage = 'Failed to add address.';
        this.loading.addresses = false;
      }
    });
  }

  editAddress(address: any) {
    this.addressForm.patchValue(address);
  }

  deleteAddress(addressId: number) {
    this.customerService.deleteAddress(addressId).subscribe({
      next: (response: { success: any; message: string; }) => {
        if (response.success) {
          this.successMessage = 'Address deleted successfully.';
          this.loadAddresses();
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to delete address.';
      }
    });
  }

  toggleNewsletter(event: any) {
    const subscribed = event.target.checked;
    this.customerService.updateNewsletterPreferences({ subscribed }).subscribe({
      next: (response: { success: any; message: string; }) => {
        if (response.success) {
          this.assumedFeatures.newsletter.subscribed = subscribed;
          this.successMessage = 'Newsletter preferences updated.';
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to update newsletter preferences.';
      }
    });
  }

  requestAccountClosure() {
    if (confirm('Are you sure you want to close your account? This action cannot be undone.')) {
      this.customerService.closeAccount(this.userId).subscribe({
        next: (response: { success: any; message: string; }) => {
          if (response.success) {
            this.successMessage = 'Account closed successfully.';
            this.authService.logout();
          } else {
            this.errorMessage = response.message;
          }
        },
        error: () => {
          this.errorMessage = 'Failed to close account.';
        }
      });
    }
  }

  writeReview(review: any) {
    // Implement logic to navigate to or display the review form
  }

  unfollowSeller(sellerId: number) {
    this.customerService.unfollowSeller(sellerId).subscribe({
      next: (response: { success: any; message: string; }) => {
        if (response.success) {
          this.successMessage = 'Seller unfollowed successfully.';
          this.loadAssumedFeatures(); // Reload the followed sellers list
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to unfollow seller.';
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
