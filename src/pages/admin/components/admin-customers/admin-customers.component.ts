// src/app/pages/admin/admin-customers/admin-customers.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { User } from '../../../../models/admin';
import { AdminService } from '../../../../services/admin/admin.service';
import { LoadingService } from '../../../../services/shared/loading.service';
import { NotificationService } from '../../../../services/shared/notification.service';


@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AdminSidebarComponent,
    AdminHeaderComponent
  ],
  templateUrl: './admin-customers.component.html'
})
export class AdminCustomersComponent implements OnInit {
  customers: User[] = [];
  isLoading = false;
  
  // Filtering and pagination
  searchTerm = '';
  statusFilter = '';
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
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.loadingService.show();
    
    this.adminService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.totalItems = customers.length;
        
        // Apply filtering
        if (this.searchTerm) {
          this.customers = this.customers.filter(c => 
            c.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            c.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        }
        
        if (this.statusFilter) {
          this.customers = this.customers.filter(c => c.status === this.statusFilter);
        }
        
        // Apply sorting
        this.customers.sort((a, b) => {
          let compareResult = 0;
          
          if (this.sortField === 'name') {
            compareResult = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          } else if (this.sortField === 'email') {
            compareResult = a.email.localeCompare(b.email);
          } else if (this.sortField === 'createdAt') {
            compareResult = a.createdAt.getTime() - b.createdAt.getTime();
          } else if (this.sortField === 'lastLogin') {
            const aTime = a.lastLogin ? a.lastLogin.getTime() : 0;
            const bTime = b.lastLogin ? b.lastLogin.getTime() : 0;
            compareResult = aTime - bTime;
          }
          
          return this.sortDirection === 'asc' ? compareResult : -compareResult;
        });
        
        // Apply pagination
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.customers = this.customers.slice(startIndex, startIndex + this.pageSize);
        
        this.isLoading = false;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error loading customers', error);
        this.notificationService.showError('Failed to load customers');
        this.isLoading = false;
        this.loadingService.hide();
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadCustomers();
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    this.loadCustomers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCustomers();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadCustomers();
  }

  updateCustomerStatus(id: string, status: User['status']): void {
    this.loadingService.show();
    
    this.adminService.updateCustomerStatus(id, status).subscribe({
      next: () => {
        this.notificationService.showSuccess('Customer status updated successfully');
        this.loadCustomers();
      },
      error: (error) => {
        console.error('Error updating customer status', error);
        this.notificationService.showError('Failed to update customer status');
        this.loadingService.hide();
      }
    });
  }

  getStatusBadgeClass(status: User['status']): string {
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

  getFullName(customer: User): string {
    return `${customer.firstName} ${customer.lastName}`;
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