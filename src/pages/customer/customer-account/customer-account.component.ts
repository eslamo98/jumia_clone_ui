import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer/customer.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserProfile, UpdateUserProfile, ChangePassword, Order, Address, PaginatedResponse, CreateAddressInput, WishlistItem } from '../../../models/customer';

@Component({
  selector: 'app-customer-account',
  templateUrl: './customer-account.component.html',
  styleUrls: ['./customer-account.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule
  ]
})
export class CustomerAccountComponent implements OnInit {
  // Add Math utility for template usage
  protected readonly Math = Math;
  
  profileForm: FormGroup;
  passwordForm: FormGroup;
  addressForm: FormGroup;
  profile: UserProfile | null = null;
  orders: Order[] = [];
  addresses: Address[] = [];
  wishlist: WishlistItem[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  activeSection: string = 'orders';
  userId: number | null = null;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalAddresses: number = 0;
  
  // Password visibility controls
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Add order pagination properties
  orderCurrentPage: number = 1;
  orderPageSize: number = 5;
  orderTotalPages: number = 1;
  orderTotalCount: number = 0;

  // Add wishlist pagination properties
  wishlistCurrentPage: number = 1;
  wishlistPageSize: number = 8;
  wishlistTotalPages: number = 1;
  wishlistTotalCount: number = 0;

  // Password strength calculation
  get passwordStrength(): number {
    const password = this.passwordForm.get('newPassword')?.value;
    if (!password) return 0;

    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 25;
    // Contains numbers
    if (/\d/.test(password)) strength += 25;
    // Contains lowercase letters
    if (/[a-z]/.test(password)) strength += 25;
    // Contains uppercase letters or special characters
    if (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;

    return strength;
  }

  getPasswordStrengthLabel(): string {
    const strength = this.passwordStrength;
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Fair';
    if (strength <= 75) return 'Good';
    return 'Strong';
  }

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.pattern(/^\d{9,15}$/)]]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.addressForm = this.fb.group({
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: [''],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
      isDefault: [false],
      addressName: ['Home']
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user && user.userId) {
      if (user.userType !== 'customer') {
        this.errorMessage = 'This page is for customers only.';
        this.router.navigate(['/unauthorized']);
        return;
      }
      this.userId = user.userId;
      this.loadProfile();
      this.loadOrders();
      this.loadAddresses();
      this.loadWishlist();
    } else {
      this.errorMessage = 'Please log in to view your account.';
      this.router.navigate(['/auth/login']);
    }
  }

  loadProfile(): void {
    if (this.userId) {
      this.customerService.getProfile(this.userId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.profile = response.data;
            this.profileForm.patchValue({
              firstName: this.profile.firstName,
              lastName: this.profile.lastName,
              phoneNumber: this.profile.phoneNumber
            });
          } else {
            this.errorMessage = response.message || 'Unable to load profile.';
          }
        },
        error: () => this.errorMessage = 'Failed to connect to the server.'
      });
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid && this.userId) {
      const request: UpdateUserProfile = this.profileForm.value;
      this.customerService.updateProfile(this.userId, request).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.profile = response.data;
            this.successMessage = 'Profile updated successfully.';
            this.errorMessage = null;
            // Update stored user data if necessary
            const currentUser = this.authService.currentUserValue;
            if (currentUser) {
              currentUser.firstName = response.data.firstName;
              currentUser.lastName = response.data.lastName;
              localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
          } else {
            this.errorMessage = response.message || 'Failed to update profile.';
          }
        },
        error: () => this.errorMessage = 'Failed to connect to the server.'
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid && this.userId) {
      const request: ChangePassword = {
        oldPassword: this.passwordForm.get('oldPassword')?.value,
        newPassword: this.passwordForm.get('newPassword')?.value
      };
      this.customerService.changePassword(this.userId, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Password changed successfully.';
            this.errorMessage = null;
            this.passwordForm.reset();
            // Reset password visibility
            this.showCurrentPassword = false;
            this.showNewPassword = false;
            this.showConfirmPassword = false;
          } else {
            this.errorMessage = response.message || 'Failed to change password.';
          }
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Failed to connect to the server.';
        }
      });
    }
  }

  loadOrders(): void {
    if (this.userId) {
      this.customerService.getOrders().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.orders = response.data.items;
            this.orderTotalPages = response.data.totalPages;
            this.orderTotalCount = response.data.totalCount;
            this.orderCurrentPage = response.data.pageNumber;
          } else {
            this.errorMessage = response.message || 'Unable to load orders.';
          }
        },
        error: () => this.errorMessage = 'Failed to connect to the server.'
      });
    }
  }

  loadAddresses(): void {
    if (this.userId) {
      this.customerService.getAddresses(this.userId, this.currentPage, this.pageSize).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.addresses = response.data.items;
            this.totalPages = response.data.totalPages;
            this.totalAddresses = response.data.totalCount;
          } else {
            this.errorMessage = response.message || 'Unable to load addresses.';
          }
        },
        error: () => this.errorMessage = 'Failed to connect to the server.'
      });
    }
  }

  addAddress(): void {
    if (this.addressForm.valid && this.userId) {
      const address: CreateAddressInput = {
        ...this.addressForm.value,
        userId: this.userId
      };

      this.customerService.createAddress(address).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.successMessage = 'Address added successfully.';
            this.errorMessage = null;
            this.addressForm.reset({
              isDefault: false,
              addressName: 'Home'
            });
            this.loadAddresses();
          } else {
            this.errorMessage = response.message || 'Failed to add address.';
          }
        },
        error: () => this.errorMessage = 'Failed to connect to the server.'
      });
    }
  }

  deleteAddress(addressId: number): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.customerService.deleteAddress(addressId).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Address deleted successfully.';
            this.errorMessage = null;
            this.loadAddresses();
          } else {
            this.errorMessage = response.message || 'Failed to delete address.';
          }
        },
        error: () => this.errorMessage = 'Failed to connect to the server.'
      });
    }
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadAddresses();
    }
  }

  changeOrderPage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.orderTotalPages) {
      this.orderCurrentPage = newPage;
      this.loadOrders();
    }
  }

  loadWishlist(): void {
    if (this.userId) {
      this.customerService.getWishlist(this.userId, this.wishlistCurrentPage, this.wishlistPageSize).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.wishlist = response.data.items;
            this.wishlistTotalPages = response.data.totalPages;
            this.wishlistTotalCount = response.data.totalCount;
            this.wishlistCurrentPage = response.data.pageNumber;
          } else {
            this.errorMessage = response.message || 'Unable to load wishlist.';
          }
        },
        error: () => this.errorMessage = 'Failed to connect to the server.'
      });
    }
  }

  removeFromWishlist(wishlistId: number): void {
    if (confirm('Are you sure you want to remove this item from your wishlist?')) {
      this.customerService.removeFromWishlist(wishlistId).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Item removed from wishlist.';
            this.errorMessage = null;
            this.loadWishlist();
          } else {
            this.errorMessage = response.message || 'Failed to remove item from wishlist.';
          }
        },
        error: () => this.errorMessage = 'Failed to connect to the server.'
      });
    }
  }

  moveToCart(wishlistId: number): void {
    this.customerService.moveToCart(wishlistId).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Item moved to cart successfully.';
          this.errorMessage = null;
          this.loadWishlist();
        } else {
          this.errorMessage = response.message || 'Failed to move item to cart.';
        }
      },
      error: () => this.errorMessage = 'Failed to connect to the server.'
    });
  }

  changeWishlistPage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.wishlistTotalPages) {
      this.wishlistCurrentPage = newPage;
      this.loadWishlist();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}