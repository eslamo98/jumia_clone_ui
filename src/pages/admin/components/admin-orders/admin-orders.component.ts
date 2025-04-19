// src/app/pages/admin/admin-orders/admin-orders.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { Order } from '../../../../models/admin';
import { AdminService } from '../../../../services/admin/admin.service';
import { LoadingService } from '../../../../services/shared/loading.service';
import { NotificationService } from '../../../../services/shared/notification.service';


@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AdminSidebarComponent,
    AdminHeaderComponent
  ],
  templateUrl: './admin-orders.component.html'
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = false;
  
  // Filtering and pagination
  searchTerm = '';
  statusFilter = '';
  startDate: string | null = null;
  endDate: string | null = null;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  
  // Make Math available to template
  Math = Math;

  constructor(
    private adminService: AdminService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.loadingService.show();
    
    this.adminService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.totalItems = orders.length;
        
        // Apply filtering
        if (this.searchTerm) {
          this.orders = this.orders.filter(o => 
            o.id.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            o.customerName.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        }
        
        if (this.statusFilter) {
          this.orders = this.orders.filter(o => o.status === this.statusFilter);
        }
        
        if (this.startDate) {
          const start = new Date(this.startDate);
          this.orders = this.orders.filter(o => new Date(o.date) >= start);
        }
        
        if (this.endDate) {
          const end = new Date(this.endDate);
          end.setHours(23, 59, 59); // End of day
          this.orders = this.orders.filter(o => new Date(o.date) <= end);
        }
        
        // Sort by date, newest first
        this.orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        // Apply pagination
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.orders = this.orders.slice(startIndex, startIndex + this.pageSize);
        
        this.isLoading = false;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error loading orders', error);
        this.notificationService.showError('Failed to load orders');
        this.isLoading = false;
        this.loadingService.hide();
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  updateOrderStatus(id: number, status: Order['status']): void {
    this.loadingService.show();
    
    this.adminService.updateOrderStatus(id, status).subscribe({
      next: () => {
        this.notificationService.showSuccess('Order status updated successfully');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating order status', error);
        this.notificationService.showError('Failed to update order status');
        this.loadingService.hide();
      }
    });
  }

  getStatusBadgeClass(status: Order['status']): string {
    switch (status) {
      case 'pending':
        return 'bg-warning';
      case 'processing':
        return 'bg-info';
      case 'shipped':
        return 'bg-primary';
      case 'delivered':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      case 'completed':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}