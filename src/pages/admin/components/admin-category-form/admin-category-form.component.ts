// src/app/pages/admin/admin-category-form/admin-category-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { Category } from '../../../../models/admin';
import { AdminService } from '../../../../services/admin/admin.service';
import { LoadingService } from '../../../../services/shared/loading.service';
import { NotificationService } from '../../../../services/shared/notification.service';


@Component({
  selector: 'app-admin-category-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSidebarComponent,
    AdminHeaderComponent
  ],
  templateUrl: './admin-category-form.component.html'
})
export class AdminCategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  categories: Category[] = [];
  isLoading = false;
  isEditMode = false;
  categoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryForm = this.createCategoryForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.categoryId = params['id'];
        this.isEditMode = true;
        this.loadCategory(this.categoryId);
      }
    });
  }

  createCategoryForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      image: [''],
      parentId: [''],
      status: ['active', Validators.required]
    });
  }

  loadCategories(): void {
    this.adminService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories', error);
        this.notificationService.showError('Failed to load categories');
      }
    });
  }

  loadCategory(id: number | null): void {
    if (!id) return;
    this.isLoading = true;
    this.loadingService.show();
    
    this.adminService.getCategoryById(id).subscribe({
      next: (category) => {
        if (category) {
          this.categoryForm.patchValue({
            name: category.name,
            description: category.description || '',
            image: category.image || '',
            parentId: category.parentId || '',
            status: category.status
          });
        } else {
          this.notificationService.showError('Category not found');
          this.router.navigate(['/admin/categories']);
        }
        
        this.isLoading = false;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error loading category', error);
        this.notificationService.showError('Failed to load category');
        this.isLoading = false;
        this.loadingService.hide();
        this.router.navigate(['/admin/categories']);
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      this.categoryForm.markAllAsTouched();
      this.notificationService.showWarning('Please fix the form errors');
      return;
    }
    
    this.isLoading = true;
    this.loadingService.show();
    
    const categoryData = this.categoryForm.value;
    
    // Remove empty parentId
    if (!categoryData.parentId) {
      delete categoryData.parentId;
    }
    
    if (this.isEditMode && this.categoryId) {
      // Update existing category
      this.adminService.updateCategory(this.categoryId, categoryData).subscribe({
        next: (category) => {
          this.notificationService.showSuccess('Category updated successfully');
          this.isLoading = false;
          this.loadingService.hide();
          this.router.navigate(['/admin/categories']);
        },
        error: (error) => {
          console.error('Error updating category', error);
          this.notificationService.showError('Failed to update category');
          this.isLoading = false;
          this.loadingService.hide();
        }
      });
    } else {
      // Create new category
      this.adminService.createCategory(categoryData).subscribe({
        next: (category) => {
          this.notificationService.showSuccess('Category created successfully');
          this.isLoading = false;
          this.loadingService.hide();
          this.router.navigate(['/admin/categories']);
        },
        error: (error) => {
          console.error('Error creating category', error);
          this.notificationService.showError('Failed to create category');
          this.isLoading = false;
          this.loadingService.hide();
        }
      });
    }
  }

  // Helper methods for form validation
  get f() { 
    return this.categoryForm.controls; 
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const control = this.categoryForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
  
  getErrorMessage(fieldName: string): string {
    const control = this.categoryForm.get(fieldName);
    if (!control) return '';
    
    if (control.errors?.['required']) {
      return 'This field is required';
    }
    
    if (control.errors?.['minlength']) {
      return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
    }
    
    return 'Invalid value';
  }

  // Filter out the current category from parent options to prevent circular references
  getParentOptions(): Category[] {
    if (!this.isEditMode) return this.categories;
    return this.categories.filter(category => category.id !== this.categoryId);
  }
}