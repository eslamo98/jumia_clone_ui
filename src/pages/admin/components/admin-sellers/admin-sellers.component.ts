// src/app/pages/admin/admin-sellers/admin-sellers.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { Seller } from '../../../../models/admin';
import { AdminService } from '../../../../services/admin/admin.service';
import { LoadingService } from '../../../../services/shared/loading.service';
import { NotificationService } from '../../../../services/shared/notification.service';


@Component({
  selector: 'app-admin-sellers',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AdminSidebarComponent,
    AdminHeaderComponent
  ],
  templateUrl: './admin-sellers.component.html'
})
export class AdminSellersComponent implements OnInit {
  sellers: Seller[] = [];
  isLoading = false;
  
  // Filtering and pagination
  searchTerm = '';
  statusFilter = '';
  verificationFilter = '';
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  
  // Sorting
  sortField = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  // Make Math available to template
  Math = Math;

  constructor(
    private adminService: AdminService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadSellers();
  }

  loadSellers(): void {
    this.isLoading = true;
    this.loadingService.show();
    
    this.adminService.getSellers().subscribe({
      next: (sellers) => {
        this.sellers = sellers;
        this.totalItems = sellers.length;
        
        // Apply filtering
        if (this.searchTerm) {
          this.sellers = this.sellers.filter(s => 
            s.storeName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        }
        
        if (this.statusFilter) {
          this.sellers = this.sellers.filter(s => s.status === this.statusFilter);
        }
        
        if (this.verificationFilter) {
          this.sellers = this.sellers.filter(s => s.verificationStatus === this.verificationFilter);
        }
        
        // Apply sorting
        this.sellers.sort((a, b) => {
          let compareResult = 0;
          
          if (this.sortField === 'storeName') {
            compareResult = a.storeName.localeCompare(b.storeName);
          } else if (this.sortField === 'email') {
            compareResult = a.email.localeCompare(b.email);
          } else if (this.sortField === 'createdAt') {
            compareResult = a.createdAt.getTime() - b.createdAt.getTime();
          } else if (this.sortField === 'rating') {
            const aRating = a.rating || 0;
            const bRating = b.rating || 0;
            compareResult = aRating - bRating;
          }
          
          return this.sortDirection === 'asc' ? compareResult : -compareResult;
        });
        
        // Apply pagination
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.sellers = this.sellers.slice(startIndex, startIndex + this.pageSize);
        
        this.isLoading = false;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error loading sellers', error);
        this.notificationService.showError('Failed to load sellers');
        this.isLoading = false;
        this.loadingService.hide();
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadSellers();
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    this.loadSellers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadSellers();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadSellers();
  }

  updateSellerStatus(id: string, status: Seller['status']): void {
    this.loadingService.show();
    
    this.adminService.updateSellerStatus(id, status).subscribe({
      next: () => {
        this.notificationService.showSuccess('Seller status updated successfully');
        this.loadSellers();
      },
      error: (error) => {
        console.error('Error updating seller status', error);
        this.notificationService.showError('Failed to update seller status');
        this.loadingService.hide();
      }
    });
  }

  updateVerificationStatus(id: string, status: Seller['verificationStatus'], reason?: string): void {
    this.loadingService.show();
    
    this.adminService.updateSellerVerification(id, status, reason).subscribe({
      next: () => {
        this.notificationService.showSuccess('Seller verification status updated successfully');
        this.loadSellers();
      },
      error: (error) => {
        console.error('Error updating seller verification status', error);
        this.notificationService.showError('Failed to update seller verification status');
        this.loadingService.hide();
      }
    });
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