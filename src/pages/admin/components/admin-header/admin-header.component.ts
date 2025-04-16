// src/app/pages/admin/admin-header/admin-header.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';
import { NotificationService } from '../../../../services/shared/notification.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="bg-white shadow-sm">
      <div class="px-4 py-3 d-flex justify-content-between align-items-center">
        <div>
          <div class="input-group">
            <span class="input-group-text bg-light border-0">
              <i class="bi bi-search"></i>
            </span>
            <input type="text" class="form-control bg-light border-0" placeholder="Search..." [(ngModel)]="searchQuery">
          </div>
        </div>
        
        <div class="d-flex align-items-center">
          <!-- Notifications dropdown -->
          <div class="dropdown me-3">
            <button class="btn position-relative" type="button" id="notificationsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-bell fs-5"></i>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{unreadNotifications}}
                <span class="visually-hidden">unread notifications</span>
              </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="notificationsDropdown" style="width: 300px;">
              <li><h6 class="dropdown-header">Notifications</h6></li>
              <li><hr class="dropdown-divider"></li>
              <li *ngFor="let notification of notifications">
                <a class="dropdown-item d-flex align-items-center p-2" href="#">
                  <div class="me-3">
                    <div class="icon-circle bg-primary text-white rounded-circle p-2">
                      <i class="bi {{notification.icon}}"></i>
                    </div>
                  </div>
                  <div>
                    <div class="small text-muted">{{notification.time | date:'short'}}</div>
                    <span [class.fw-bold]="!notification.read">{{notification.message}}</span>
                  </div>
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-center" href="#">Show All Notifications</a></li>
            </ul>
          </div>
          
          <!-- User dropdown -->
          <div class="dropdown">
            <button class="btn d-flex align-items-center" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="assets/images/admin-avatar.jpg" class="rounded-circle me-2" width="32" height="32" alt="Admin Avatar">
              <span>Admin User</span>
              <i class="bi bi-chevron-down ms-1"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Profile</a></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Settings</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" (click)="logout()"><i class="bi bi-box-arrow-right me-2"></i>Sign Out</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .icon-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 2rem;
      width: 2rem;
    }
  `]
})
export class AdminHeaderComponent {
  searchQuery: string = '';
  unreadNotifications: number = 3;
  
  notifications = [
    { 
      message: 'New order #1234 has been placed', 
      time: new Date(), 
      read: false,
      icon: 'bi-cart'
    },
    { 
      message: 'New seller registration request', 
      time: new Date(Date.now() - 3600000), 
      read: false,
      icon: 'bi-shop' 
    },
    { 
      message: 'Product inventory is low for 5 items', 
      time: new Date(Date.now() - 7200000), 
      read: false,
      icon: 'bi-exclamation-triangle'
    },
    { 
      message: 'Monthly sales report is ready', 
      time: new Date(Date.now() - 86400000), 
      read: true,
      icon: 'bi-graph-up'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  logout(): void {
    this.authService.logout();
    this.notificationService.showSuccess('You have been logged out successfully');
    this.router.navigate(['/auth/login']);
  }
}