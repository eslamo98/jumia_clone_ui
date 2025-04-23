// src/app/pages/admin/admin-sidebar/admin-sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SidebarMenuItem {
  label: string;
  icon: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar-container p-3" style="height: 100vh; overflow-y: auto;">
      <div class="d-flex align-items-center justify-content-center mb-4">
        <img src="assets/images/logo.png" alt="Jumia Logo" height="40" class="me-2">
        <h4 class="text-white mb-0">Admin</h4>
      </div>
      
      <ul class="nav flex-column">
        <li class="nav-item mb-2" *ngFor="let item of menuItems">
          <a 
            class="nav-link d-flex align-items-center" 
            [routerLink]="item.route"
            routerLinkActive="active"
            [ngClass]="{'active': item.active}"
          >
            <i class="bi {{ item.icon }} me-2"></i>
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .sidebar-container {
      height: 100%;
    }
    
    .nav-link {
      color: rgba(255, 255, 255, 0.8);
      border-radius: 5px;
      padding: 8px 16px;
      transition: all 0.3s;
    }
    
    .nav-link:hover, .nav-link.active {
      color: white;
      background-color: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class AdminSidebarComponent {
  menuItems: SidebarMenuItem[] = [
    { label: 'Dashboard', icon: 'bi-house-fill', route: '/admin', active: true },
    { label: 'Products', icon: 'bi-box-seam', route: '/admin/products' },
    { label: 'Product Attributes', icon: 'bi-box-seam', route: '/admin/product-attributes' },
    { label: 'Categories', icon: 'bi-tags', route: '/admin/categories' },
    { label: 'Subcategories', icon: 'bi-list', route: '/admin/subcategories' },
    { label: 'Orders', icon: 'bi-cart-check', route: '/admin/orders' },
    { label: 'Customers', icon: 'bi-people', route: '/admin/customers' },
    { label: 'Sellers', icon: 'bi-shop', route: '/admin/sellers' },
    { label: 'Reviews', icon: 'bi-star', route: '/admin/reviews' },
    { label: 'Settings', icon: 'bi-gear', route: '/admin/settings' }
  ];
}