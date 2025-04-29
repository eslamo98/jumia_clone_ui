// src/pages/seller/seller-productEdit/seller-product-form/seller-product-form.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../seller-sidebar/sidebar/sidebar.component';
import {
  ProductFormData,
  ProductVariantFormData,
  Product,
} from '../../../../models/product';
import {
  BasicCategoiesInfo,
  BasicSubCategoriesInfo,
  Category,
  Subcategory,
} from '../../../../models/admin';
import { LoadingService } from '../../../../services/shared/loading.service';
import { NotificationService } from '../../../../services/shared/notification.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DynamicAttributeInputComponent } from '../../../../shared/dynamic-attribute-input/dynamic-attribute-input.component';
import { environment } from '../../../../environments/environment';
import { SellerService } from '../../../../services/seller/seller.service';

@Component({
  selector: 'app-seller-product-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SidebarComponent,
    DynamicAttributeInputComponent,
  ],
  templateUrl: './seller-product-form.component.html',
  styleUrls: ['./seller-product-form.component.css'],
})
export class SellerProductFormComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  categories: BasicCategoiesInfo[] = [];
  filteredCategories: BasicCategoiesInfo[] = [];
  subcategories: BasicSubCategoriesInfo[] = [];
  isLoading = false;
  isEditMode = false;
  productId!: number;
  defaultVariantRequired = false;
  imagePreview: string | null = null;
  mainImageFile: File | null = null;
  subcategoryAttributes: any[] = [];
  additionalImagePreviews: string[] = [];
  maxAdditionalImages = 6;
  additionalImageInputs: any[] = [];
  additionalImageFiles: (File | null)[] = [];
  private categorySearchSubject = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private sellerService: SellerService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.createProductForm();

    // Setup search debounce for categories
    this.categorySearchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.filterCategories(searchTerm);
      });
  }

  getFullImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return 'assets/images/placeholder.jpg';
    return `${environment.apiUrl}/${imagePath}`;
  }

  ngOnInit(): void {
    this.loadCategories();

    // Check if we're in edit mode first
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.productId = parseInt(params['id'], 10);
        this.isEditMode = true;
        this.loadProduct(this.productId);
      }
    });

    // Setup subscriptions after checking edit mode
    this.setupFormSubscriptions();
  }

  private setupFormSubscriptions(): void {
    // Watch for category changes to load subcategories
    this.productForm
      .get('categoryId')
      ?.valueChanges.subscribe((categoryId: number) => {
        const subcategoryControl = this.productForm.get('subcategoryId');
        if (categoryId) {
          if (!this.isEditMode) {
            // Only load subcategories if not in edit mode
            this.loadSubcategories(categoryId);
          }
          subcategoryControl?.enable();
        } else {
          this.subcategories = [];
          subcategoryControl?.disable();
        }
      });

    // Watch for subcategory changes to load attributes
    this.productForm
      .get('subcategoryId')
      ?.valueChanges.subscribe((subcategoryId: number) => {
        if (subcategoryId && !this.isEditMode) {
          // Only load attributes if not in edit mode
          this.loadSubcategoryAttributes(subcategoryId);
        } else if (!subcategoryId) {
          this.subcategoryAttributes = [];
          this.clearAttributeValues();
        }
      });

    // Watch for hasVariants changes
    this.productForm
      .get('hasVariants')
      ?.valueChanges.subscribe((hasVariants: boolean) => {
        if (hasVariants) {
          this.addVariant();
        } else {
          (this.productForm.get('variants') as FormArray).clear();
        }
        this.updateVariantValidation(hasVariants);
      });
  }

  createProductForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      discountPercentage: [0, [Validators.min(0), Validators.max(100)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      mainImageFile: [null],
      categoryId: ['', Validators.required],
      subcategoryId: [{ value: '', disabled: true }, Validators.required],
      hasVariants: [false],
      isAvailable: [true],
      approvalStatus: ['pending'],
      variants: this.fb.array([]),
      attributeValues: this.fb.array([]),
    });
  }

  createVariantFormGroup(): FormGroup {
    return this.fb.group({
      variantId: [null],
      variantName: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPercentage: [0, [Validators.min(0), Validators.max(100)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      sku: ['', Validators.required],
      variantImageFile: [null],
      variantImageBase64: [''],
      variantImageUrl: [''],
      isDefault: [false],
      isAvailable: [true],
      attributeValues: this.fb.array([]),
    });
  }

  onAdditionalImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Store the file
      this.additionalImageFiles[index] = file;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.additionalImagePreviews[index] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addImageInput(): void {
    if (this.additionalImageInputs.length >= this.maxAdditionalImages) {
      this.notificationService.showWarning(
        `Maximum of ${this.maxAdditionalImages} additional images allowed`
      );
      return;
    }

    this.additionalImageInputs.push({});
    this.additionalImagePreviews.push('');
    this.additionalImageFiles.push(null);
  }

  removeAdditionalImageInput(index: number): void {
    this.additionalImageInputs.splice(index, 1);
    this.additionalImagePreviews.splice(index, 1);
    this.additionalImageFiles.splice(index, 1);
  }

  onVariantImageSelected(event: Event, variantIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const variant = this.getVariantFormGroup(variantIndex);

      // Create Base64 string
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        variant.patchValue({
          variantImageFile: file,
          variantImageBase64: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  private setupVariantAttributes(variant: FormGroup, attributes: any[]): void {
    const attributeValues = variant.get('attributeValues') as FormArray;
    attributeValues.clear();

    attributes.forEach((attr) => {
      const attributeGroup = this.fb.group({
        attributeId: [attr.attributeId],
        attributeName: [attr.name],
        attributeType: [attr.type],
        value: [''],
        options: [attr.options || []],
      });
      attributeValues.push(attributeGroup);
    });
  }

  private updateVariantsAttributes(): void {
    if (!this.productForm.get('hasVariants')?.value) return;

    const variants = this.variants.controls;
    variants.forEach((variant) => {
      if (variant instanceof FormGroup) {
        this.setupVariantAttributes(variant, this.subcategoryAttributes);
      }
    });
  }

  addVariant() {
    const variantGroup = this.createVariantFormGroup();
    this.setupVariantAttributes(variantGroup, this.subcategoryAttributes);
    this.variants.push(variantGroup);
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
      const hasDefault = variantsArray.value.some(
        (v: ProductVariantFormData) => v.isDefault
      );
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

  getVariantAttributeValue(
    variantIndex: number,
    attributeIndex: number,
    field: string
  ): any {
    const variant = this.getVariantFormGroup(variantIndex);
    const attributeValues = variant.get('attributeValues') as FormArray;
    const attribute = attributeValues.at(attributeIndex) as FormGroup;
    return attribute.get(field)?.value;
  }

  loadProduct(productId: number): void {
    this.isLoading = true;
    this.sellerService.getProductById(productId).subscribe({
      next: (product) => {
        // Enable the subcategory control before setting its value
        this.productForm.get('subcategoryId')?.enable();

        // Set main form values
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          basePrice: product.basePrice,
          discountPercentage: product.discountPercentage,
          stockQuantity: product.stockQuantity,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId,
          isAvailable: product.isAvailable,
          // Remove approvalStatus since it's not defined in Product type
          hasVariants: product.variants && product.variants.length > 0,
        });

        // Set main image preview
        if (product.mainImageUrl) {
          this.imagePreview = this.getFullImageUrl(product.mainImageUrl);
        }

        // Load subcategories for the selected category
        this.loadSubcategories(product.categoryId);

        // Load additional images
        if (product.images && product.images.length > 0) {
          this.additionalImageInputs = [];
          this.additionalImagePreviews = [];

          product.images.forEach((image: any) => {
            this.additionalImageInputs.push({});
            this.additionalImagePreviews.push(
              this.getFullImageUrl(image.imageUrl)
            );
            this.additionalImageFiles.push(null);
          });
        }

        // Load variants if any
        if (product.variants && product.variants.length > 0) {
          const variantsArray = this.productForm.get('variants') as FormArray;
          variantsArray.clear();

          product.variants.forEach((variant: any) => {
            const variantGroup = this.createVariantFormGroup();
            variantGroup.patchValue({
              variantId: variant.variantId,
              variantName: variant.variantName,
              price: variant.price,
              discountPercentage: variant.discountPercentage,
              stockQuantity: variant.stockQuantity,
              sku: variant.sku,
              isDefault: variant.isDefault,
              isAvailable: variant.isAvailable,
            });

            // Set variant image preview if available
            if (variant.variantImageUrl) {
              variantGroup.patchValue({
                variantImageBase64: this.getFullImageUrl(
                  variant.variantImageUrl
                ),
              });
            }

            // Load variant attributes
            if (variant.attributes && variant.attributes.length > 0) {
              const attributesArray = variantGroup.get(
                'attributeValues'
              ) as FormArray;
              attributesArray.clear();

              variant.attributes.forEach((attr: any) => {
                attributesArray.push(
                  this.fb.group({
                    attributeId: [attr.variantAttributeId],
                    attributeName: [attr.attributeName],
                    attributeType: ['text'], // Default to text if not specified
                    value: [attr.attributeValue],
                    options: [[]], // Default empty options
                  })
                );
              });
            }

            variantsArray.push(variantGroup);
          });

          this.updateVariantValidation(true);
        }

        // Load product attributes
        if (product.attributeValues && product.attributeValues.length > 0) {
          const attributesArray = this.productForm.get(
            'attributeValues'
          ) as FormArray;
          attributesArray.clear();

          product.attributeValues.forEach((attr: any) => {
            attributesArray.push(
              this.fb.group({
                attributeId: [attr.attributeId],
                attributeName: [attr.attributeName],
                attributeType: [attr.attributeType],
                value: [attr.value],
                options: [[]], // Default empty options
              })
            );
          });
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.notificationService.showError('Failed to load product details');
        this.isLoading = false;
      },
    });
  }

  private loadSubcategoryAttributes(subcategoryId: number): void {
    this.isLoading = true;
    this.sellerService.getSubcategoryAttributes(subcategoryId).subscribe({
      next: (attributes) => {
        this.subcategoryAttributes = attributes;
        this.setupProductAttributes(attributes);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading subcategory attributes:', error);
        this.notificationService.showError(
          'Failed to load subcategory attributes'
        );
        this.isLoading = false;
      },
    });
  }

  private setupProductAttributes(attributes: any[]): void {
    const attributeValues = this.productForm.get(
      'attributeValues'
    ) as FormArray;
    attributeValues.clear();

    attributes.forEach((attr) => {
      const attributeGroup = this.fb.group({
        attributeId: [attr.attributeId],
        attributeName: [attr.name],
        attributeType: [attr.type],
        value: [''],
        options: [attr.options || []],
      });
      attributeValues.push(attributeGroup);
    });
  }

  onMainImageSelected(event: Event): void {
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

  private formatAttributeValues(): any[] {
    const attributeValues = this.productForm.get('attributeValues')?.value;

    if (!attributeValues || attributeValues.length === 0) {
      return [];
    }

    return attributeValues
      .filter(
        (attr: any) =>
          attr.value !== null &&
          attr.value !== undefined &&
          attr.value.toString().trim() !== ''
      )
      .map((attr: any) => ({
        AttributeId: parseInt(attr.attributeId),
        Value: attr.value.toString(),
      }));
  }

  private formatVariants(): any[] {
    const variants = this.variants.value;
    if (!variants || variants.length === 0) {
      return [];
    }

    return variants.map((variant: any) => {
      // Format variant attributes
      const attributes = variant.attributeValues
        .filter(
          (attr: any) =>
            attr.value !== null &&
            attr.value !== undefined &&
            attr.value.toString().trim() !== ''
        )
        .map((attr: any) => ({
          AttributeId: parseInt(attr.attributeId),
          Value: attr.value.toString(),
        }));

      return {
        VariantName: variant.variantName,
        Price: variant.price,
        DiscountPercentage: variant.discountPercentage,
        StockQuantity: variant.stockQuantity,
        SKU: variant.sku,
        IsDefault: variant.isDefault,
        IsAvailable: variant.isAvailable,
        VariantImageFile: variant.variantImageFile,
        Attributes: attributes,
        VariantId: variant.variantId || 0,
      };
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.productForm);
      this.notificationService.showError(
        'Please fix the errors in the form before submitting'
      );
      return;
    }

    this.isLoading = true;

    // Create FormData object for file uploads
    const formData = new FormData();

    // Add basic product information
    const productData = {
      Name: this.productForm.get('name')?.value,
      Description: this.productForm.get('description')?.value,
      BasePrice: this.productForm.get('basePrice')?.value,
      DiscountPercentage: this.productForm.get('discountPercentage')?.value,
      StockQuantity: this.productForm.get('stockQuantity')?.value,
      CategoryId: this.productForm.get('categoryId')?.value,
      SubcategoryId: this.productForm.get('subcategoryId')?.value,
      IsAvailable: this.productForm.get('isAvailable')?.value,
      HasVariants: this.productForm.get('hasVariants')?.value,
      AttributeValues: this.formatAttributeValues(),
      Variants: this.formatVariants(),
      ProductId: this.isEditMode ? this.productId : 0,
    };

    // Append product data as JSON
    formData.append('productData', JSON.stringify(productData));

    // Append main image if selected
    if (this.mainImageFile) {
      formData.append('mainImage', this.mainImageFile);
    }

    // Append additional images if any
    this.additionalImageFiles.forEach((file, index) => {
      if (file) {
        formData.append(`additionalImages[${index}]`, file);
      }
    });

    // Append variant images if any
    if (this.productForm.get('hasVariants')?.value) {
      const variants = this.variants.controls;
      variants.forEach((variantControl, index) => {
        const variant = variantControl as FormGroup;
        const variantImageFile = variant.get('variantImageFile')?.value;
        if (variantImageFile) {
          formData.append(`variantImages[${index}]`, variantImageFile);
        }
      });
    }

    // Submit the form
    const request = this.isEditMode
      ? this.sellerService.updateProduct(this.productId, formData)
      : this.sellerService.createProduct(formData);

    request.subscribe({
      next: (response) => {
        this.notificationService.showSuccess(
          this.isEditMode
            ? 'Product updated successfully'
            : 'Product created successfully'
        );
        this.router.navigate(['/seller/manage-products']);
      },
      error: (error) => {
        console.error('Error saving product:', error);
        this.notificationService.showError('Failed to save product');
        this.isLoading = false;
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl) => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
        });
      }
    });
  }

  loadCategories(): void {
    this.sellerService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filteredCategories = [...this.categories];
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.notificationService.showError('Failed to load categories');
      },
    });
  }

  loadSubcategories(categoryId: number): void {
    this.sellerService.getSubcategories(categoryId).subscribe({
      next: (subcategories) => {
        this.subcategories = subcategories;
      },
      error: (error) => {
        console.error('Error loading subcategories:', error);
        this.notificationService.showError('Failed to load subcategories');
      },
    });
  }

  onCategorySearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.categorySearchSubject.next(searchTerm);
  }

  filterCategories(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredCategories = [...this.categories];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter((category) =>
      category.name.toLowerCase().includes(term)
    );
  }

  // Helper methods for form access
  get variants(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  get attributeValues(): FormArray {
    return this.productForm.get('attributeValues') as FormArray;
  }

  getVariantFormGroup(index: number): FormGroup {
    return this.variants.at(index) as FormGroup;
  }

  getVariantAttributeValues(variantIndex: number): FormArray {
    return this.getVariantFormGroup(variantIndex).get(
      'attributeValues'
    ) as FormArray;
  }

  getAttributeControl(variantIndex: number, attributeIndex: number): FormGroup {
    return this.getVariantAttributeValues(variantIndex).at(
      attributeIndex
    ) as FormGroup;
  }

  getAttributeFormGroup(index: number): FormGroup {
    return this.attributeValues.at(index) as FormGroup;
  }

  getAttributeValue(index: number, field: string): any {
    return this.getAttributeFormGroup(index).get(field)?.value;
  }

  clearAttributeValues(): void {
    const attributeValues = this.productForm.get(
      'attributeValues'
    ) as FormArray;
    attributeValues.clear();
  }

  // Validation methods
  isFieldInvalid(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (!control) return '';

    if (control.errors?.['required']) return 'This field is required';
    if (control.errors?.['minlength'])
      return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors?.['min'])
      return `Value must be at least ${control.errors['min'].min}`;
    if (control.errors?.['max'])
      return `Value must be at most ${control.errors['max'].max}`;

    return 'Invalid value';
  }

  isVariantFieldInvalid(variantIndex: number, fieldName: string): boolean {
    const variant = this.getVariantFormGroup(variantIndex);
    const control = variant.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  isVariantAttributeInvalid(
    variantIndex: number,
    attributeIndex: number
  ): boolean {
    const attributeControl = this.getAttributeControl(
      variantIndex,
      attributeIndex
    );
    const valueControl = attributeControl.get('value');
    return (
      !!valueControl &&
      valueControl.invalid &&
      (valueControl.dirty || valueControl.touched)
    );
  }

  getVariantAttributeErrorMessage(
    variantIndex: number,
    attributeIndex: number
  ): string {
    const attributeControl = this.getAttributeControl(
      variantIndex,
      attributeIndex
    );
    const valueControl = attributeControl.get('value');
    if (!valueControl) return '';

    if (valueControl.errors?.['required']) return 'This field is required';
    return 'Invalid value';
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.categoryId === categoryId);
    return category ? category.name : '';
  }

  getSubcategoryName(subcategoryId: number): string {
    const subcategory = this.subcategories.find(
      (s) => s.subcategoryId === subcategoryId
    );
    return subcategory ? subcategory.name : '';
  }

  ngOnDestroy(): void {
    this.categorySearchSubject.complete();
  }
}
