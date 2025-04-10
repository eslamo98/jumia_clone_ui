// src/app/shared/components/header/header.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <header class="navbar navbar-expand-lg navbar-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <img src="assets/images/logo.png" alt="Jumia Clone" class="logo" />
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarMain">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/products" routerLinkActive="active">Products</a>
            </li>
          </ul>
          
          <ul class="navbar-nav ms-auto">
            <!-- Conditional links based on authentication -->
            <ng-container *ngIf="!(authService.currentUser$ | async)">
              <li class="nav-item">
                <a class="nav-link" routerLink="/auth/login" routerLinkActive="active">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/auth/register" routerLinkActive="active">Register</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/auth/register-seller" routerLinkActive="active">Become a Seller</a>
              </li>
            </ng-container>
            
            <!-- Authenticated user links -->
            <ng-container *ngIf="authService.currentUser$ | async as user">
              <li class="nav-item">
                <a class="nav-link" routerLink="/cart" routerLinkActive="active">
                  <i class="fas fa-shopping-cart"></i> Cart
                </a>
              </li>
              
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i class="fas fa-user"></i> My Account
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" routerLink="/account">Profile</a></li>
                  
                  <!-- Seller-specific link -->
                  <li *ngIf="user.userType === 'seller'">
                    <a class="dropdown-item" routerLink="/seller">Seller Dashboard</a>
                  </li>
                  
                  <!-- Admin-specific link -->
                  <li *ngIf="user.userType === 'admin'">
                    <a class="dropdown-item" routerLink="/admin">Admin Panel</a>
                  </li>
                  
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="javascript:void(0)" (click)="logout()">Logout</a></li>
                </ul>
              </li>
            </ng-container>
          </ul>
        </div>
      </div>
    </header>
  `,
  styles: [`
    header {
      background-color: #f68b1e; /* Jumia's orange color */
    }
    
    .logo {
      height: 40px;
      width: auto;
    }
    
    .nav-link.active {
      font-weight: bold;
    }
    
    .dropdown-item:active {
      background-color: #f68b1e;
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
  
  logout(): void {
    this.authService.logout();
    // You might want to handle navigation after logout
  }
}