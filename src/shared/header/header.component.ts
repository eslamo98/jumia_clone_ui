// shared/header/header.component.ts
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CartsService } from '../../services/cart/carts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAccountDropdownOpen = false;
  cartItemCount = 0;
  private cartSubscription: Subscription | null = null;
  private authSubscription: Subscription | null = null;
  
  constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartsService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    // Subscribe to the cartItemCount$ observable for real-time updates
    this.cartSubscription = this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });

    // Subscribe to auth state changes
    // Note: You'll need to ensure authService.currentUser$ is properly implemented
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        // If user logs in, refresh the cart count
        this.cartService.refreshCartCount();
      } else {
        // If user logs out, reset the cart count
        this.cartItemCount = 0;
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
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