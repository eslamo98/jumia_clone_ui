// src/app/pages/admin/admin-product-form/admin-product-form.component.ts
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
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSidebarComponent,
    AdminHeaderComponent
  ],
  templateUrl: './admin-product-form.component.html'
})
export class AdminProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  sellers: any[] = [];
  isLoading = false;
  isEditMode = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.createProductForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSellers();
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productId = params['id'];
        this.isEditMode = true;
        this.loadProduct(this.productId);
      }
    });
  }

  createProductForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPrice: [null],
      stock: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      images: [[]],
      categoryId: ['', Validators.required],
      sellerId: ['', Validators.required],
      status: ['active', Validators.required],
      featured: [false]
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

  loadSellers(): void {
    this.adminService.getSellers().subscribe({
      next: (sellers) => {
        this.sellers = sellers;
      },
      error: (error) => {
        console.error('Error loading sellers', error);
        this.notificationService.showError('Failed to load sellers');
      }
    });
  }

  loadProduct(id: string | null): void {
    if (!id) return;
    this.isLoading = true;
    this.loadingService.show();
    
    this.adminService.getProductById(id).subscribe({
      next: (product) => {
        if (product) {
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            discountPrice: product.discountPrice,
            stock: product.stock,
            image: product.image,
            images: product.images || [],
            categoryId: product.categoryId,
            sellerId: product.sellerId,
            status: product.status,
            featured: product.featured || false
          });
        } else {
          this.notificationService.showError('Product not found');
          this.router.navigate(['/admin/products']);
        }
        
        this.isLoading = false;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error loading product', error);
        this.notificationService.showError('Failed to load product');
        this.isLoading = false;
        this.loadingService.hide();
        this.router.navigate(['/admin/products']);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      this.productForm.markAllAsTouched();
      this.notificationService.showWarning('Please fix the form errors');
      return;
    }
    
    this.isLoading = true;
    this.loadingService.show();
    
    const productData = this.productForm.value;
    
    if (this.isEditMode && this.productId) {
      // Update existing product
      this.adminService.updateProduct(this.productId, productData).subscribe({
        next: (product) => {
          this.notificationService.showSuccess('Product updated successfully');
          this.isLoading = false;
          this.loadingService.hide();
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error updating product', error);
          this.notificationService.showError('Failed to update product');
          this.isLoading = false;
          this.loadingService.hide();
        }
      });
    } else {
      // Create new product
      this.adminService.createProduct(productData).subscribe({
        next: (product) => {
          this.notificationService.showSuccess('Product created successfully');
          this.isLoading = false;
          this.loadingService.hide();
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error creating product', error);
          this.notificationService.showError('Failed to create product');
          this.isLoading = false;
          this.loadingService.hide();
        }
      });
    }
  }

  // Helper methods for form validation
  get f() { 
    return this.productForm.controls; 
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
  
  getErrorMessage(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (!control) return '';
    
    if (control.errors?.['required']) {
      return 'This field is required';
    }
    
    if (control.errors?.['minlength']) {
      return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
    }
    
    if (control.errors?.['min']) {
      return `Value should be at least ${control.errors['min'].min}`;
    }
    
    return 'Invalid value';
  }
}