import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductVariant } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartsService } from '../../services/cart/carts.service';
import { NotificationService } from '../../services/shared/notification.service';
import { environment } from '../../environments/environment';
import { ProductService } from '../../services/products/product.service';
import { AuthService } from '../../services/auth/auth.service';

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
  showToast: boolean = false;
  
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
    public authService: AuthService,
    
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
        console.log('Product response:', response);
        if (response.success) {
          // Map the camelCase response to PascalCase interface
          console.log(response);
          this.product = {
            productId: response.data.productId,
            sellerId: response.data.sellerId,
            subcategoryId: response.data.subcategoryId,
            name: response.data.name,
            description: response.data.description,
            basePrice: response.data.basePrice,
            discountPercentage: response.data.discountPercentage,
            isAvailable: response.data.isAvailable,
            stockQuantity: response.data.stockQuantity,
            mainImageUrl: response.data.mainImageUrl,
            averageRating: response.data.averageRating,
            sellerName: response.data.sellerName,
            categoryId: response.data.categoryId,
            categoryName: response.data.categoryName,
            ratingCount: response.data.ratingCount,
            reviewCount: response.data.reviewCount,
            images: response.data.images?.map((img: any) => ({
              imageId: img.imageId,
              productId: img.productId,
              imageUrl: img.imageUrl,
              displayOrder: img.displayOrder
            })) || [],
            variants: response.data.variants?.map((variant: any) => ({
              variantId: variant.variantId,
              productId: variant.productId,
              variantName: variant.variantName,
              price: variant.price,
              discountPercentage: variant.discountPercentage,
              finalPrice: variant.finalPrice,
              stockQuantity: variant.stockQuantity,
              sku: variant.sku,
              variantImageUrl: variant.variantImageUrl,
              isDefault: variant.isDefault,
              isAvailable: variant.isAvailable,
              attributes: variant.attributes
            })) || [],
            attributeValues: response.data.attributeValues?.map((attr: any) => ({
              valueId: attr.valueId,
              productId: attr.productId,
              attributeId: attr.attributeId,
              attributeName: attr.attributeName,
              attributeType: attr.attributeType,
              value: attr.value
            })) || []
          };

          this.selectedImage = this.product.mainImageUrl;
          
          if (this.product.variants?.length > 0) {
            const defaultVariant = this.product.variants.find(v => v.isDefault);
            if (defaultVariant) {
              this.selectVariant(defaultVariant);
            }
          }
          
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
    if (variant.variantImageUrl) {
      this.selectImage(variant.variantImageUrl);
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


  isAddedToCart: boolean = false;

  public addToCart(): void {
    // Check if the product is available and the quantity is greater than 0
    if (!this.product || this.quantity < 1) return;
  
    // Check authentication first
    if (!this.authService.isAuthenticated()) {
      this.notificationService.showError('You must be logged in to add items to your cart');
      return;
    }
  
    // Mark the product as added
    this.isAddedToCart = true;
  
    // Get the productId and variantId
    const productId = this.product.productId;
    const variantId = this.selectedVariant?.variantId;
  
    // Call the service to add the item to the cart
    this.cartsService.addItemToCart(productId, this.quantity, variantId).subscribe({
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
        let errorMessage = 'Failed to add item to cart. Please try again later.';
        
        // Handle specific error cases
        if (err.status === 401) {
          errorMessage = 'Please log in first to add items to your cart';
        } else if (err.status === 404) {
          errorMessage = 'Product not found or has been removed';
        } else if (err.status === 409) {
          errorMessage = 'This item is already in your shopping cart';
        } else if (err.status === 429) {
          errorMessage = 'Too many requests. Please wait before trying again';
        } else if (err.message.includes('network error')) {
          errorMessage = 'Network connection issue. Please check your internet connection';
        }
      
        // Handle additional business logic errors
        if (err.error?.outOfStock) {
          errorMessage = 'This product is currently out of stock';
        }
      
        if (err.error?.invalidQuantity) {
          errorMessage = 'The requested quantity is not available';
        }
      
        // Show error notification
        this.notificationService.showError(errorMessage);
        
        // Detailed error logging
        console.error('Error adding item to cart:', {
          errorMessage: err.message,
          statusCode: err.status,
          requestURL: err.config?.url,
          timestamp: new Date().toISOString(),
          errorDetails: err.error
        });}
      });
   
  
  

  
    // Show the toast notification
    this.showToast = true;

    // Hide the toast after 3 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
  
  public setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}

