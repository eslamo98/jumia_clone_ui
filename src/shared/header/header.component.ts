// shared/header/header.component.ts
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CartsService } from '../../services/cart/carts.service';
import { Cart, CartItem, CartResponse } from '../../models/cart';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent implements OnInit {
  isAccountDropdownOpen = false;
  cartItemCount = 0;
  
  constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartsService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    // Initialize cart count if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.loadCartCount();
    }

    // Subscribe to auth state changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadCartCount();
      } else {
        this.cartItemCount = 0;
      }
    });
  }

  toggleAccountDropdown(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isAccountDropdownOpen = !this.isAccountDropdownOpen;
  }

  closeAccountDropdown() {
    this.isAccountDropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.cartItemCount = 0;
    this.closeAccountDropdown();
  }

  private loadCartCount(): void {
    this.cartService.getCartItems().subscribe({
      next: (response: CartResponse) => {
        if (response.success && response.data) {
          const items = response.data as unknown as CartItem[];
          this.cartItemCount = items.reduce((total: number, item: CartItem) => total + item.Quantity, 0);
        } else {
          this.cartItemCount = 0;
        }
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
        this.cartItemCount = 0;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Close dropdown if clicking outside of account section
    const clickedElement = event.target as HTMLElement;
    const isClickedInsideAccount = this.elementRef.nativeElement.querySelector('.account-section')?.contains(clickedElement);
    
    if (!isClickedInsideAccount) {
      this.closeAccountDropdown();
    }
  }
}