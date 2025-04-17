import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer/customer.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserProfile, UpdateUserProfile, ChangePassword, Order } from '../../../models/customer';

@Component({
  selector: 'app-customer-account',
  templateUrl: './customer-account.component.html',
  styleUrls: ['./customer-account.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CustomerAccountComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  addressForm: FormGroup;
  profile: UserProfile | null = null;
  orders: Order[] = [];
  wishlist: any[] = []; // TODO: Add proper wishlist interface
  messages: any[] = []; // TODO: Add proper message interface
  addresses: any[] = []; // TODO: Add proper address interface
  errorMessage: string | null = null;
  successMessage: string | null = null;
  activeSection: string = 'orders';
  userId: number | null = null;
  isSidebarOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['']
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required]
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
          } else {
            this.errorMessage = response.message || 'Failed to change password.';
          }
        },
        error: () => this.errorMessage = 'Failed to connect to the server.'
      });
    }
  }

  loadOrders(): void {
    if (this.userId) {
      this.customerService.getOrders().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.orders = response.data;
          } else {
            this.errorMessage = response.message || 'Unable to load orders.';
          }
        },
        error: () => this.errorMessage = 'Failed to connect to the server.'
      });
    }
  }

  addAddress(): void {
    if (this.addressForm.valid) {
      // TODO: Implement address addition logic
      console.log('Adding address:', this.addressForm.value);
      this.addressForm.reset();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}