
// Computing-container.component.ts
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router, RouterModule , RouterLink } from '@angular/router';
import { interval } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../../../services/products/product.service';
import { Helpers } from '../../../../../../Utility/helpers';
import { NavigationService } from '../../../../../../services/navigations/navigation.services';
import { environment } from '../../../../../../environments/environment';

interface Product {
  productId: number;
  name: string;
  description: string;
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  isAvailable: boolean;
  mainImageUrl: string;
  averageRating: number;
  sellerId: number;
  sellerName: string;
  categoryId?: string; 
  categoryName?: string; 
  subcategoryId?: string;
  subcategoryName: string;
}

@Component({
  selector: 'app-computing-container',
  imports: [CommonModule, RouterModule , RouterLink],
  templateUrl: './computing-container.component.html',
  styleUrl: './computing-container.component.css',
  standalone: true
})
export class ComputingContainerComponent extends Helpers implements OnInit, AfterViewInit {
  @ViewChild('productContainer') productContainer!: ElementRef;
  @Input() categoryName: string = 'Computing';
  @Input() categorySubtitle: string = 'Laptops';
  @Input() categoryId: string = ''; //7
  @Input() subcategoryId: string = '';
  @Input() subcategoryName: string = '';
  
  products: Product[] = [];
  hours: number = 12;
  minutes: number = 47;
  seconds: number = 33;
  timeLeft: string = '';
  showLeftArrow: boolean = false;
  showRightArrow: boolean = true;
  scrollAmount: number = 250;
  loading: boolean = true;
  error: string | null = null;
  
  constructor(
    private router: Router,
    private productService: ProductService,
    private navigationService: NavigationService
  ) { super(); }

  ngOnInit(): void {
    // Load products from API
    this.loadProductsFromApi();
    
    // Start the countdown timer
    this.startCountdown();
  }
  
  ngAfterViewInit(): void {
    setTimeout(() => this.checkScrollArrows(), 500);
  }
  
  loadProductsFromApi(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getRandomCategoryProducts(this.categoryName, 15).subscribe({
      next: (data) => {
        console.log('API response data:', data);
        
        // Handle different response formats
        if (data && Array.isArray(data)) {
          this.products = data;
        } else if (data && typeof data === 'object' && data.products) {
          // In case API returns { products: [...] }
          this.products = data.products;
        } else if (data && typeof data === 'object') {
          // If API returns a single product or object with product properties
          this.products = [data];
        } else {
          console.error('Unexpected API response format:', data);
          this.error = 'Invalid data format received from API';
          this.products = []; // Initialize as empty array
        }
        
        console.log('Processed products:', this.products);
        this.loading = false;
        setTimeout(() => this.checkScrollArrows(), 100);
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
  }
  
  startCountdown(): void {
    interval(1000).pipe(
      map(() => {
        if (this.seconds > 0) {
          this.seconds -= 1;
        } else {
          this.seconds = 59;
          if (this.minutes > 0) {
            this.minutes -= 1;
          } else {
            this.minutes = 59;
            if (this.hours > 0) {
              this.hours -= 1;
            } else {
              // Timer complete
              this.hours = 0;
              this.minutes = 0;
              this.seconds = 0;
            }
          }
        }
        
        this.timeLeft = `${this.hours}h : ${this.minutes}m : ${this.seconds}s`;
      }),
      takeWhile(() => this.hours > 0 || this.minutes > 0 || this.seconds > 0)
    ).subscribe();
  }
  
  scrollLeft(): void {
    if (this.productContainer) {
      this.productContainer.nativeElement.scrollLeft -= this.scrollAmount;
      setTimeout(() => this.checkScrollArrows(), 100);
    }
  }
  
  scrollRight(): void {
    if (this.productContainer) {
      this.productContainer.nativeElement.scrollLeft += this.scrollAmount;
      setTimeout(() => this.checkScrollArrows(), 100);
    }
  }
  
  checkScrollArrows(): void {
    if (!this.productContainer) return;
    
    const container = this.productContainer.nativeElement;
    this.showLeftArrow = container.scrollLeft > 0;
    this.showRightArrow = container.scrollWidth > container.clientWidth + container.scrollLeft;
  }
  
  navigateToProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]);
  }
  
  calculateProgressBarWidth(available: number, total: number = 250): string {
    const percentage = (available / total) * 100;
    return `${percentage}%`;
  }
  
  getProgressBarColor(quantity: number): string {
    return quantity < 10 ? '#e41e23' : '#ff9900';
  }
  
  navigateToCategory(): void {
    // Log the values we're sending to the navigation service
    console.log('Navigating to category with ID:', this.categoryId);
    console.log('Navigating with subcategory ID:', this.subcategoryId);
    
    // If categoryId is empty, we might need to find a fallback
    if (!this.categoryId && this.products.length > 0) {
      console.log('No categoryId set, attempting to use categoryId from products');
      this.categoryId = this.products[0].categoryId?.toString() || '';
    }
    
    // Store both category name and ID in the navigation service
    this.navigationService.setCategoryName(this.categoryName);
    this.navigationService.setCategoryId(this.categoryId);
    
    // Store subcategory information if available
    if (this.subcategoryId) {
      this.navigationService.setSubcategoryId(this.subcategoryId);
    }
    
    // Store it as a full category object for convenience
    this.navigationService.setSelectedCategory({
      id: this.categoryId,
      name: this.categoryName,
      subtitle: this.categorySubtitle
    });
    
    // If we have a subcategory, store that too
    if (this.subcategoryId) {
      this.navigationService.setSelectedSubcategory({
        id: this.subcategoryId,
        name: this.subcategoryName || this.categorySubtitle
      });
    }
    
    // Navigate to the category page with the category ID
    if (this.categoryId) {
      if (this.subcategoryId) {
        // You could navigate with both IDs if your routing supports it
        this.router.navigate(['/category', this.categoryId, 'subcategory', this.subcategoryId]);
      } else {
        this.router.navigate(['/category', this.categoryId]);
      }
    } else {
      console.error('No category ID available for navigation');
      this.router.navigate(['/category']);
    }
  
  // getFullImageUrl(relativePath: string): string {
  //   if (!relativePath) return 'assets/images/placeholder-product.png';
  //   if (relativePath.startsWith('http')) return relativePath;
  //   return `${environment.apiUrl}/${relativePath}`;
  // }
}
}