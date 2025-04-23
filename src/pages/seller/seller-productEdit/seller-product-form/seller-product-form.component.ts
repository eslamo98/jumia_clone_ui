import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ManageProductsService } from '../../../../services/seller/manageproducts.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-seller-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seller-product-form.component.html',
  styleUrl: './seller-product-form.component.css',
})
export class SellerProductFormComponent implements OnInit {
  productId: number = 0;
  productForm: FormGroup;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private manageProductsService: ManageProductsService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      basePrice: ['', [Validators.required, Validators.min(0)]],
      finalPrice: ['', [Validators.required, Validators.min(0)]],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      // Add more form controls as needed
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = +params['id'];
      if (this.productId) {
        this.loadProductData();
      }
    });
  }

  loadProductData() {
    this.loading = true;
    this.manageProductsService.getProductById(this.productId).subscribe({
      next: (response) => {
        if (response.success) {
          this.productForm.patchValue(response.data);
        } else {
          this.error = 'Failed to load product data';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading product data';
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.loading = true;
      const productData = this.productForm.value;

      this.manageProductsService
        .updateProduct(this.productId, productData)
        .subscribe({
          next: (response) => {
            if (response.success) {
              // Handle success (e.g., show success message, navigate back)
            } else {
              this.error = 'Failed to update product';
            }
            this.loading = false;
          },
          error: (error) => {
            this.error = 'Error updating product';
            this.loading = false;
          },
        });
    }
  }
}
