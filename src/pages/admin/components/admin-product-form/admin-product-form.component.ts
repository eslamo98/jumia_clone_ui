// src/app/pages/admin/admin-product-form/admin-product-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { ProductFormData, ProductVariantFormData, Product } from '../../../../models/product';
import { BasicCategoiesInfo, BasicSellerInfo, BasicSubCategoriesInfo, Category, Seller, Subcategory } from '../../../../models/admin';
import { AdminService } from '../../../../services/admin/admin.service';
import { ProductsService } from '../../../../services/admin/products.service';
import { LoadingService } from '../../../../services/shared/loading.service';
import { NotificationService } from '../../../../services/shared/notification.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AdminSidebarComponent,
    AdminHeaderComponent
  ],
  templateUrl: './admin-product-form.component.html'
})
export class AdminProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: BasicCategoiesInfo[] = [];
  filteredCategories: BasicCategoiesInfo[] = [];
  subcategories: BasicSubCategoriesInfo[] = [];
  sellers: BasicSellerInfo[] = [];
  filteredSellers: BasicSellerInfo[] = [];
  isLoading = false;
  isEditMode = false;
  productId!: number;
  defaultVariantRequired = false;
  imagePreview: string | null = null;
  mainImageFile: File | null = null;

  private categorySearchSubject = new Subject<string>();
  private sellerSearchSubject = new Subject<string>();

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

    // Setup search debounce for categories
    this.categorySearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filterCategories(searchTerm);
    });

    // Setup search debounce for sellers
    this.sellerSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filterSellers(searchTerm);
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSellers();

    // Watch for category changes to load subcategories
    this.productForm.get('categoryId')?.valueChanges.subscribe((categoryId: number) => {
      const subcategoryControl = this.productForm.get('subcategoryId');
      if (categoryId) {
        this.loadSubcategories(categoryId);
        subcategoryControl?.enable();
      } else {
        this.subcategories = [];
        subcategoryControl?.disable();
      }
    });

    // Watch for hasVariants changes to handle variant validation
    this.productForm.get('hasVariants')?.valueChanges.subscribe((hasVariants: boolean) => {
      if (hasVariants) {
        this.addVariant(); // Add at least one variant when enabled
      } else {
        (this.productForm.get('variants') as FormArray).clear();
      }
      this.updateVariantValidation(hasVariants);
    });
    
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
      mainImageFile: [null, Validators.required],
      categoryId: ['', Validators.required],
      subcategoryId: ['', Validators.required], // Initialize as enabled
      sellerId: ['', Validators.required],
      hasVariants: [false],
      isAvailable: [true],
      approvalStatus: ['pending'],
      variants: this.fb.array([]),
      attributeValues: this.fb.array([])
    });
  }

  createVariantFormGroup(): FormGroup {
    return this.fb.group({
      variantName: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPercentage: [0, [Validators.min(0), Validators.max(100)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      sku: ['', Validators.required],
      variantImageUrl: [''],
      isDefault: [false],
      isAvailable: [true],
      attributes: this.fb.array([])
    });
  }

  get variants() {
    return this.productForm.get('variants') as FormArray;
  }

  addVariant() {
    this.variants.push(this.createVariantFormGroup());
    this.updateVariantValidation(true);
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
    this.updateVariantValidation(this.variants.length > 0);
  }

  updateVariantValidation(hasVariants: boolean) {
    const variantsArray = this.variants;
    this.defaultVariantRequired = hasVariants;

    if (hasVariants && variantsArray.length > 0) {
      // Ensure at least one variant is marked as default
      const hasDefault = variantsArray.value.some((v: ProductVariantFormData) => v.isDefault);
      if (!hasDefault) {
        variantsArray.at(0).patchValue({ isDefault: true });
      }
    }
  }

  onDefaultVariantChange(selectedIndex: number) {
    // Update other variants to not be default
    this.variants.controls.forEach((control, index) => {
      if (index !== selectedIndex) {
        control.patchValue({ isDefault: false }, { emitEvent: false });
      }
    });
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.loadingService.show();
    
    this.productsService.getProductById(id, true).subscribe({
      next: (product) => {
        if (product) {
          const hasVariants = product.variants && product.variants.length > 0;
          
          // Patch main product data
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            basePrice: product.basePrice,
            discountPercentage: product.discountPercentage,
            stockQuantity: product.stockQuantity,
            mainImageFile: product.mainImageUrl,
            categoryId: product.categoryId,
            sellerId: product.sellerId,
            hasVariants: hasVariants,
            isAvailable: product.isAvailable
          });

          // Load variants if they exist
          if (hasVariants) {
            this.variants.clear();
            product.variants.forEach(variant => {
              const variantGroup = this.createVariantFormGroup();
              variantGroup.patchValue({
                variantName: variant.variantName,
                price: variant.price,
                discountPercentage: variant.discountPercentage,
                stockQuantity: variant.stockQuantity,
                sku: variant.sku,
                variantImageUrl: variant.variantImageUrl,
                isDefault: variant.isDefault,
                isAvailable: variant.isAvailable
              });
              this.variants.push(variantGroup);
            });
            this.updateVariantValidation(true);
          }
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

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.mainImageFile = file;
      this.productForm.patchValue({ mainImageFile: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      this.notificationService.showWarning('Please fix the form errors');
      return;
    }

    if (this.productForm.get('hasVariants')?.value && !this.hasDefaultVariant()) {
      this.notificationService.showWarning('Please select a default variant');
      return;
    }
    
    this.isLoading = true;
    this.loadingService.show();
    
    const formData = new FormData();
    const productData = this.prepareProductData();
    
    // Append all product data to FormData
    for (const [key, value] of Object.entries(productData)) {
      if (key === 'variants' || key === 'attributeValues') {
        formData.append(key + 'Json', JSON.stringify(value));
      } else if (key !== 'mainImageFile') { // Skip mainImageFile as we'll handle it separately
        formData.append(key, value.toString());
      }
    }

    // Append the actual file
    if (this.mainImageFile) {
      formData.append('MainImageFile', this.mainImageFile);
    }

    const request = this.isEditMode ? 
      this.productsService.updateProduct(this.productId, formData) :
      this.productsService.createProduct(formData);

    request.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          `Product ${this.isEditMode ? 'updated' : 'created'} successfully`
        );
        this.router.navigate(['/admin/products']);
      },
      error: (error) => {
        console.error('Error saving product', error);
        this.notificationService.showError(`Failed to ${this.isEditMode ? 'update' : 'create'} product`);
        this.isLoading = false;
        this.loadingService.hide();
      }
    });
  }

  private prepareProductData(): ProductFormData {
    const formValue = this.productForm.value;
    return {
      ...formValue,
      variants: formValue.hasVariants ? formValue.variants : []
    };
  }

  private hasDefaultVariant(): boolean {
    return this.variants.controls.some(control => control.get('isDefault')?.value === true);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  isVariantFieldInvalid(variantIndex: number, fieldName: string): boolean {
    const control = this.variants.at(variantIndex).get(fieldName);
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
      return `Value must be at least ${control.errors['min'].min}`;
    }

    if (control.errors?.['max']) {
      return `Value cannot exceed ${control.errors['max'].max}`;
    }
    
    return 'Invalid value';
  }

  loadCategories(): void {
    this.isLoading = true;
    this.adminService.getBasicCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filteredCategories = [...this.categories];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.notificationService.showError('Failed to load categories');
        this.isLoading = false;
      }
    });
  }

  loadSellers(): void {
    this.isLoading = true;
    this.adminService.getBasicSellers().subscribe({
      next: (sellers) => {
        this.sellers = sellers;
        this.filteredSellers = [...this.sellers];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading sellers:', error);
        this.notificationService.showError('Failed to load sellers');
        this.isLoading = false;
      }
    });
  }

  loadSubcategories(categoryId: number): void {
    this.isLoading = true;
    this.productForm.get('subcategoryId')?.setValue(''); // Reset subcategory when category changes
    
    this.adminService.getBasicSubcategoriesByCategory(categoryId).subscribe({
      next: (subcategories) => {
        this.subcategories = subcategories;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading subcategories:', error);
        this.notificationService.showError('Failed to load subcategories');
        this.isLoading = false;
      }
    });
  }

  // Category search and filter methods
  onCategorySearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.categorySearchSubject.next(searchTerm);
  }

  private filterCategories(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredCategories = [...this.categories];
      return;
    }
    
    searchTerm = searchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm)
    );
  }

  // Seller search and filter methods
  onSellerSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.sellerSearchSubject.next(searchTerm);
  }

  private filterSellers(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredSellers = [...this.sellers];
      return;
    }
    
    searchTerm = searchTerm.toLowerCase();
    this.filteredSellers = this.sellers.filter(seller => 
      seller.name.toLowerCase().includes(searchTerm)
    );
  }
}