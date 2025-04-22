import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside
      class="sidebar bg-white border-end shadow-sm vh-100 d-flex flex-column px-3 py-3"
      [class.collapsed]="isCollapsed()"
    >
      <!-- Logo Header -->
      <header class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex flex-column" [class.d-none]="isCollapsed()">
          <span class="fs-4 fw-bold" style="color: #f68b1e;">VC</span>
          <small class="text-muted">VENDOR CENTER</small>
        </div>
        <button class="btn btn-link p-0 text-dark" (click)="toggleSidebar()">
          <i
            class="pi"
            [class.pi-bars]="!isCollapsed()"
            [class.pi-angle-right]="isCollapsed()"
          ></i>
        </button>
      </header>

      <!-- Navigation Menu -->
      <nav class="flex-grow-1">
        <!-- Orders -->
        <a
          class="nav-item d-flex align-items-center py-2 px-2 rounded text-dark text-decoration-none"
          [class.active]="activeSection() === 'orders'"
          (click)="setActiveSection('orders')"
          [title]="isCollapsed() ? 'Orders' : ''"
        >
          <i class="pi pi-book me-2"></i>
          <span [class.d-none]="isCollapsed()">Orders</span>
        </a>

        <!-- Products with Submenu -->
        <div class="mb-2">
          <button
            class="nav-item d-flex align-items-center py-2 px-2 rounded w-100 border-0 bg-transparent"
            [class.active]="activeSection() === 'products'"
            (click)="toggleProducts()"
          >
            <i class="pi pi-box me-2"></i>
            <span [class.d-none]="isCollapsed()">Products</span>
            <i
              class="pi pi-chevron-down ms-auto transition-transform"
              [style.transform]="isProductsOpen() ? 'rotate(180deg)' : 'none'"
            ></i>
          </button>

          <!-- Products Submenu -->
          <div *ngIf="isProductsOpen()" class="ps-4 mt-1">
            <a
              class="nav-item d-flex align-items-center py-2 px-2 rounded text-dark text-decoration-none"
              [class.active]="activeSubSection() === 'all-products'"
              (click)="setActiveSubSection('all-products')"
            >
              <span>All Products</span>
            </a>
            <a
              class="nav-item d-flex align-items-center py-2 px-2 rounded text-dark text-decoration-none"
              [class.active]="activeSubSection() === 'add-product'"
              (click)="setActiveSubSection('add-product')"
            >
              <span>Add Product</span>
            </a>
          </div>
        </div>

        <!-- Other Menu Items -->
        <a
          class="nav-item d-flex align-items-center py-2 px-2 rounded text-dark text-decoration-none"
          [class.active]="activeSection() === 'promotions'"
          (click)="setActiveSection('promotions')"
          [title]="isCollapsed() ? 'Promotions' : ''"
        >
          <i class="pi pi-tags me-2"></i>
          <span [class.d-none]="isCollapsed()">Promotions</span>
        </a>

        <a
          class="nav-item d-flex align-items-center py-2 px-2 rounded text-dark text-decoration-none"
          [class.active]="activeSection() === 'advertise'"
          (click)="setActiveSection('advertise')"
          [title]="isCollapsed() ? 'Advertise your Products' : ''"
        >
          <i class="pi pi-megaphone me-2"></i>
          <span [class.d-none]="isCollapsed()">Advertise your Products</span>
        </a>

        <a
          class="nav-item d-flex align-items-center py-2 px-2 rounded text-dark text-decoration-none"
          [class.active]="activeSection() === 'statements'"
          (click)="setActiveSection('statements')"
          [title]="isCollapsed() ? 'Account Statements' : ''"
        >
          <i class="pi pi-chart-bar me-2"></i>
          <span [class.d-none]="isCollapsed()">Account Statements</span>
        </a>
      </nav>

      <!-- Footer Section -->
      <footer class="mt-4" [class.d-none]="isCollapsed()">
        <button
          class="btn w-100 mb-3 py-2"
          style="background-color: #fff8f3; color: #f68b1e;"
        >
          <i class="pi pi-store me-2"></i>
          Choose Shops
        </button>

        <div class="d-flex align-items-center py-2">
          <div
            class="rounded-circle bg-primary d-flex align-items-center justify-content-center"
            style="width: 38px; height: 38px;"
          >
            <span class="text-white fw-medium">M</span>
          </div>
          <div class="ms-3 flex-grow-1">
            <div class="fw-medium">TechTitans</div>
            <div class="text-muted small">medomedoftab&#64;gmail.com</div>
          </div>
          <i class="pi pi-chevron-down"></i>
        </div>
      </footer>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        width: 250px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        transition: all 0.3s ease;
      }
      .sidebar.collapsed {
        width: 60px;
      }
      .nav-item {
        transition: background-color 0.2s;
        white-space: nowrap;
        overflow: hidden;
      }
      .nav-item:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }
      .nav-item.active {
        background-color: rgba(0, 0, 0, 0.08);
      }
      .transition-transform {
        transition: transform 0.2s ease;
      }
    `,
  ],
})
export class SidebarComponent {
  isCollapsed = signal<boolean>(false);
  activeSection = signal<string>('');
  activeSubSection = signal<string>('');
  isProductsOpen = signal<boolean>(false);

  toggleSidebar() {
    this.isCollapsed.update((v) => !v);
    if (this.isCollapsed()) {
      this.isProductsOpen.set(false);
    }
  }

  toggleProducts() {
    this.isProductsOpen.update((v) => !v);
    this.setActiveSection('products');
  }

  setActiveSection(section: string) {
    this.activeSection.set(section);
    if (section !== 'products') {
      this.isProductsOpen.set(false);
    }
  }

  setActiveSubSection(subSection: string) {
    this.activeSubSection.set(subSection);
    event?.stopPropagation();
  }
}
