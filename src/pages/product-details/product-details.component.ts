import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductVariant } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartsService } from '../../services/cart/carts.service';
import { NotificationService } from '../../services/shared/notification.service';
import { environment } from '../../environments/environment';
import { ProductService } from '../../services/products/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  isLoading = true;
  errorMessage = '';
  product!: Product;
  selectedVariant: ProductVariant | null = null;
  selectedImage: string = '';
  quantity: number = 1;
  activeTab: string = 'details';
  isFollowing: boolean = false;
  selectedLocation: number = 1;
  freeDeliveryThreshold: number = 500;
  
  deliveryLocations = [
    { id: 1, name: 'Al Beheira' },
    { id: 2, name: 'Damanhour' }
  ];

  deliveryOptions = [
    { type: 'Pickup Station', fee: 10, leadDays: 2 },
    { type: 'Door Delivery', fee: 30, leadDays: 2 }
  ];

  returnPolicy: string = '30 days return policy';
  defectReportDays: number = 7;

  reviews = [ 
    { reviewer: 'Alice', rating: 5, comment: 'Great product!' },
    { reviewer: 'Bob', rating: 4, comment: 'Good quality, but a bit expensive.' },
    { reviewer: 'Charlie', rating: 3, comment: 'Average experience.' },
    { reviewer: 'David', rating: 2, comment: 'Not what I expected.' },
    { reviewer: 'Eve', rating: 1, comment: 'Very disappointed.' }
  ];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartsService: CartsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (isNaN(id)) {
      this.errorMessage = 'Invalid product ID';
      this.isLoading = false;
      return;
    }
  
    this.productService.getProductById(id, true).subscribe({
      next: (response) => {
        if (response.success) {
          // Map the camelCase response to PascalCase interface
          this.product = {
            ProductId: response.data.productId,
            SellerId: response.data.sellerId,
            SubcategoryId: response.data.subcategoryId,
            Name: response.data.name,
            Description: response.data.description,
            BasePrice: response.data.basePrice,
            DiscountPercentage: response.data.discountPercentage,
            IsAvailable: response.data.isAvailable,
            StockQuantity: response.data.stockQuantity,
            MainImageUrl: response.data.mainImageUrl,
            AverageRating: response.data.averageRating,
            SellerName: response.data.sellerName,
            CategoryId: response.data.categoryId,
            CategoryName: response.data.categoryName,
            RatingCount: response.data.ratingCount,
            ReviewCount: response.data.reviewCount,
            Images: response.data.images?.map((img: any) => ({
              ImageId: img.imageId,
              ProductId: img.productId,
              ImageUrl: img.imageUrl,
              DisplayOrder: img.displayOrder
            })) || [],
            Variants: response.data.variants?.map((variant: any) => ({
              VariantId: variant.variantId,
              ProductId: variant.productId,
              VariantName: variant.variantName,
              Price: variant.price,
              DiscountPercentage: variant.discountPercentage,
              FinalPrice: variant.finalPrice,
              StockQuantity: variant.stockQuantity,
              Sku: variant.sku,
              VariantImageUrl: variant.variantImageUrl,
              IsDefault: variant.isDefault,
              IsAvailable: variant.isAvailable,
              Attributes: variant.attributes
            })) || [],
            AttributeValues: response.data.attributeValues?.map((attr: any) => ({
              ValueId: attr.valueId,
              ProductId: attr.productId,
              AttributeId: attr.attributeId,
              AttributeName: attr.attributeName,
              AttributeType: attr.attributeType,
              Value: attr.value
            })) || []
          };

          this.selectedImage = this.product.MainImageUrl;
          
          if (this.product.Variants?.length > 0) {
            const defaultVariant = this.product.Variants.find(v => v.IsDefault);
            if (defaultVariant) {
              this.selectVariant(defaultVariant);
            }
          }
          
          console.log('Product mapped successfully:', this.product);
          this.isLoading = false;
        } else {
          this.errorMessage = response.message || 'Failed to load product';
          console.error('Error loading product:', response.message);
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
        this.errorMessage = err.status === 0 
          ? 'Cannot connect to server' 
          : 'Failed to load product details';
      }
    });
  }

  public selectVariant(variant: ProductVariant): void {
    this.selectedVariant = variant;
    if (variant.VariantImageUrl) {
      this.selectImage(variant.VariantImageUrl);
    }
    this.quantity = 1; // Reset quantity when changing variants
  }

  public selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }
  public getFullImageUrl(imagePath: string): string {
    return `${environment.apiUrl}/${imagePath}`;
  }
  public getDeliveryDates(leadDays: number): string {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + leadDays);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  }

  public addToCart(): void {
    if (!this.product || this.quantity < 1) return;

    const productId = this.product.ProductId;
    const variantId = this.selectedVariant?.VariantId;
    
    this.cartsService.addItemToCart(productId, this.quantity).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('Item added to cart successfully');
          console.log('Item added to cart:', response.data);
        } else {
          this.notificationService.showError(response.message || 'Failed to add item to cart');
          console.error('Failed to add item to cart:', response.message);
        }
      },
      error: (err) => {
        this.notificationService.showError('Error adding item to cart. Please try again.');
        console.error('Error adding item to cart:', err);
      }
    });
  }

  public setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}

