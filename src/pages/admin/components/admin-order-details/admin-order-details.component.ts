// src/app/pages/admin/admin-order-details/admin-order-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { Order } from '../../../../models/admin';
import { AdminService } from '../../../../services/admin/admin.service';
import { LoadingService } from '../../../../services/shared/loading.service';
import { NotificationService } from '../../../../services/shared/notification.service';

@Component({
  selector: 'app-admin-order-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AdminSidebarComponent,
    AdminHeaderComponent
  ],
  templateUrl: './admin-order-details.component.html'
})
export class AdminOrderDetailsComponent implements OnInit {
  orderId!: number;
  order: Order | null = null;
  isLoading = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderId = parseInt(params['id']);
        this.loadOrder(this.orderId);
      } else {
        this.router.navigate(['/admin/orders']);
      }
    });
  }

  loadOrder(id: number | null): void {
    if (!id) return;
    this.isLoading = true;
    this.loadingService.show();
    
    this.adminService.getOrderById(id).subscribe({
      next: (order) => {
        if (order) {
          this.order = order;
        } else {
          this.notificationService.showError('Order not found');
          this.router.navigate(['/admin/orders']);
        }
        
        this.isLoading = false;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error loading order', error);
        this.notificationService.showError('Failed to load order');
        this.isLoading = false;
        this.loadingService.hide();
        this.router.navigate(['/admin/orders']);
      }
    });
  }

  updateOrderStatus(status: Order['status']): void {
    if (!this.orderId) return;
    
    this.loadingService.show();
    
    this.adminService.updateOrderStatus(this.orderId, status).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        this.notificationService.showSuccess('Order status updated successfully');
        this.loadingService.hide();
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

  calculateOrderTotal(): number {
    if (!this.order || !this.order.items) return 0;
    
    return this.order.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
}