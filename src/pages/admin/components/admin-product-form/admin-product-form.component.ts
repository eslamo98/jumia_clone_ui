// src/app/pages/admin/admin-product-form/admin-product-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { Category, Product, Seller } from '../../../../models/admin';
import { AdminService } from '../../../../services/admin/admin.service';
import { ProductsService } from '../../../../services/admin/products.service';
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
  sellers: Seller[] = [];
  isLoading = false;
  isEditMode = false;
  productId!: number;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private productsService: ProductsService,
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
        this.productId = parseInt(params['id'], 10);
        this.isEditMode = true;
        this.loadProduct(this.productId);
      }
    });
  }

  createProductForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      discountPercentage: [0, [Validators.min(0), Validators.max(100)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      mainImageUrl: ['', Validators.required],
      categoryId: ['', Validators.required],
      sellerId: ['', Validators.required],
      approvalStatus: ['pending', Validators.required],
      isAvailable: [true]
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

  loadProduct(id: number): void {
    this.isLoading = true;
    this.loadingService.show();
    
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        if (product) {
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            basePrice: product.basePrice,
            discountPercentage: product.discountPercentage,
            stockQuantity: product.stockQuantity,
            mainImageUrl: product.mainImageUrl,
            categoryId: product.categoryId,
            sellerId: product.sellerId,
            approvalStatus: product.approvalStatus,
            isAvailable: product.isAvailable
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
      this.productForm.markAllAsTouched();
      this.notificationService.showWarning('Please fix the form errors');
      return;
    }
    
    this.isLoading = true;
    this.loadingService.show();
    
    const productData = new FormData();
    Object.keys(this.productForm.value).forEach(key => {
      productData.append(key, this.productForm.value[key]);
    });
    
    if (this.isEditMode) {
      this.productsService.updateProduct(this.productId, productData).subscribe({
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
      this.productsService.createProduct(productData).subscribe({
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

    if (control.errors?.['max']) {
      return `Value should not exceed ${control.errors['max'].max}`;
    }
    
    return 'Invalid value';
  }
}