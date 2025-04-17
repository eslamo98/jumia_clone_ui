// src/app/pages/admin/admin-seller-details/admin-seller-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { Product, Seller } from '../../../../models/admin';
import { AdminService } from '../../../../services/admin/admin.service';
import { LoadingService } from '../../../../services/shared/loading.service';
import { NotificationService } from '../../../../services/shared/notification.service';


@Component({
  selector: 'app-admin-seller-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AdminSidebarComponent,
    AdminHeaderComponent
  ],
  templateUrl: './admin-seller-details.component.html'
})
export class AdminSellerDetailsComponent implements OnInit {
  sellerId: string | null = null;
  seller: Seller | null = null;
  sellerProducts: Product[] = [];
  isLoading = false;
  activeTab = 'overview';
  rejectionReason = '';
  
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
        this.sellerId = params['id'];
        this.loadSeller(this.sellerId);
      } else {
        this.router.navigate(['/admin/sellers']);
      }
    });
  }

  loadSeller(id: string | null): void {
    if (!id) return;
    this.isLoading = true;
    this.loadingService.show();
    
    this.adminService.getSellerById(id).subscribe({
      next: (seller) => {
        if (seller) {
          this.seller = seller;
          this.loadSellerProducts();
        } else {
          this.notificationService.showError('Seller not found');
          this.router.navigate(['/admin/sellers']);
        }
      },
      error: (error) => {
        console.error('Error loading seller', error);
        this.notificationService.showError('Failed to load seller');
        this.isLoading = false;
        this.loadingService.hide();
        this.router.navigate(['/admin/sellers']);
      }
    });
  }

  loadSellerProducts(): void {
    if (!this.sellerId) {
      this.isLoading = false;
      this.loadingService.hide();
      return;
    }
    
    this.adminService.getProducts().subscribe({
      next: (products) => {
        // Filter products for this seller
        this.sellerProducts = products.filter(product => product.sellerId === this.sellerId);
        
        this.isLoading = false;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error loading seller products', error);
        this.isLoading = false;
        this.loadingService.hide();
      }
    });
  }

  updateSellerStatus(status: Seller['status']): void {
    if (!this.sellerId) return;
    
    this.loadingService.show();
    
    this.adminService.updateSellerStatus(this.sellerId, status).subscribe({
      next: () => {
        if (this.seller) {
          this.seller.status = status;
        }
        this.notificationService.showSuccess('Seller status updated successfully');
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error updating seller status', error);
        this.notificationService.showError('Failed to update seller status');
        this.loadingService.hide();
      }
    });
  }

  updateVerificationStatus(status: Seller['verificationStatus']): void {
    if (!this.sellerId) return;
    
    let reason = undefined;
    if (status === 'rejected') {
      if (!this.rejectionReason.trim()) {
        this.notificationService.showWarning('Please provide a rejection reason');
        return;
      }
      reason = this.rejectionReason;
    }
    
    this.loadingService.show();
    
    this.adminService.updateSellerVerification(this.sellerId, status, reason).subscribe({
      next: () => {
        if (this.seller) {
          this.seller.verificationStatus = status;
          this.seller.rejectionReason = reason;
        }
        this.notificationService.showSuccess('Seller verification status updated successfully');
        this.rejectionReason = '';
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error updating seller verification status', error);
        this.notificationService.showError('Failed to update seller verification status');
        this.loadingService.hide();
      }
    });
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  getStatusBadgeClass(status: Seller['status']): string {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'inactive':
        return 'bg-secondary';
      case 'banned':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getVerificationBadgeClass(status: Seller['verificationStatus']): string {
    switch (status) {
      case 'verified':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'rejected':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getFullName(seller: Seller): string {
    return `${seller.firstName} ${seller.lastName}`;
  }
}