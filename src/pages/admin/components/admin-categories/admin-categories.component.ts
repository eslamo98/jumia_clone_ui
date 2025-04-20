// src/app/pages/admin/admin-categories/admin-categories.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { Category } from '../../../../models/admin';
import { AdminService } from '../../../../services/admin/admin.service';
import { LoadingService } from '../../../../services/shared/loading.service';
import { NotificationService } from '../../../../services/shared/notification.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AdminSidebarComponent,
    AdminHeaderComponent
  ],
  templateUrl: './admin-categories.component.html'
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  isLoading = false;
  searchTerm = '';
  statusFilter = '';
  
  constructor(
    private adminService: AdminService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.loadingService.show();
    
    this.adminService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
        this.loadingService.hide();
      },
      error: (error: Error) => {
        console.error('Error loading categories:', error);
        this.notificationService.showError('Failed to load categories');
        this.isLoading = false;
        this.loadingService.hide();
      }
    });
  }

  onSearch(): void {
    this.loadCategories();
  }

  onFilterChange(): void {
    this.loadCategories();
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.loadingService.show();
      
      this.adminService.deleteCategory(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Category deleted successfully');
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category', error);
          this.notificationService.showError('Failed to delete category');
          this.loadingService.hide();
        }
      });
    }
  }

  updateCategoryStatus(id: number, status: 'active' | 'inactive'): void {
    this.loadingService.show();
    
    this.adminService.updateCategory(id, { status }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Category status updated successfully');
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error updating category status', error);
        this.notificationService.showError('Failed to update category status');
        this.loadingService.hide();
      }
    });
  }

  getParentCategoryName(parentId?: number): string {
    if (!parentId) return 'None';
    const parent = this.categories.find(c => c.id === parentId);
    return parent ? parent.name : 'Unknown';
  }
}