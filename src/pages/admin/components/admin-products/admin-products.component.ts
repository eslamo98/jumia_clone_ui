// src/app/pages/admin/admin-products/admin-products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { Product, ProductQueryParams } from '../../../../models/admin';
import { AdminService } from '../../../../services/admin/admin.service';
import { LoadingService } from '../../../../services/shared/loading.service';
import { NotificationService } from '../../../../services/shared/notification.service';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';


@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AdminSidebarComponent,
    AdminHeaderComponent
  ],
  templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  
  // Filtering and pagination
  searchTerm = '';
  categoryFilter = '';
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
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.loadingService.show();
    
    const queryParams: ProductQueryParams = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
      searchTerm: this.searchTerm,
      categoryId: this.categoryFilter ? parseInt(this.categoryFilter) : undefined,
      sortBy: this.sortField,
      sortDirection: this.sortDirection,
      approvalStatus: this.statusFilter as 'pending' | 'approved' | 'rejected' | 'deleted' | 'pending_review'
    };

    this.adminService.getProducts(queryParams).subscribe({
      next: (products) => {
        this.products = products;
        this.totalItems = products.length;
        this.isLoading = false;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.notificationService.showError('Failed to load products');
        this.isLoading = false;
        this.loadingService.hide();
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.loadingService.show();
      
      this.adminService.deleteProduct(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Product deleted successfully');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product', error);
          this.notificationService.showError('Failed to delete product');
          this.loadingService.hide();
        }
      });
    }
  }

  updateProductStatus(id: number, status: 'pending' | 'approved' | 'rejected' | 'deleted' | 'pending_review'): void {
    this.loadingService.show();
    
    this.adminService.updateProduct(id, { approvalStatus: status }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Product status updated successfully');
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error updating product status', error);
        this.notificationService.showError('Failed to update product status');
        this.loadingService.hide();
      }
    });
  }

  featuredToggle(id: number, featured: boolean): void {
    this.loadingService.show();
    
    this.adminService.updateProduct(id, { isAvailable: featured }).subscribe({
      next: () => {
        this.notificationService.showSuccess(`Product ${featured ? 'marked as featured' : 'removed from featured'}`);
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error updating product featured status', error);
        this.notificationService.showError('Failed to update product');
        this.loadingService.hide();
      }
    });
  }

  getCategoryName(categoryId: number): string {
    const categories: Record<number, string> = {
      1: 'Electronics',
      2: 'Accessories',
      3: 'Computer Hardware',
      4: 'Fashion',
      5: 'Home & Kitchen',
      6: 'Beauty & Health'
    };
    return categories[categoryId] || 'Unknown';
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