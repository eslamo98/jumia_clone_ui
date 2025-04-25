import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../services/categories/categories.service';
import { ProductService } from '../../../../services/products/product.service';
import { NavigationService } from '../../../../services/navigations/navigation.services';
import { environment } from '../../../../environments/environment';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ComputingContainerComponent } from "../../../public/home-page/homeComponents/computingContainer/computing-container/computing-container.component";
import { Helpers } from '../../../../Utility/helpers';
import { UpArrowComponent } from "../../../public/home-page/homeComponents/upArrow/up-arrow/up-arrow.component";

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

interface Subcategory {
  subcategoryId: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

// Define API response interfaces
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ProductsData {
  products: Product[];
  totalItems: number;
}


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule , UpArrowComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent  extends Helpers implements OnInit {
  categoryId: string = '';
  categoryName: string = '';
  subcategories: Subcategory[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = []; // Products for current page
  selectedSubcategoryId: string = '';
  loading: boolean = true;
  error: string | null = null;
  
  // For pagination
  currentPage = 1;
  pageSize = 10; // Display 10 products per page
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];
  Math = Math; // Add Math to be used in template

   // Wishlist and cart
   wishlistItems: number[] = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService,
    private navigationService: NavigationService
  ) {
    super(); 
   }

   ngOnInit(): void {

    window.scrollTo(0, 0);
    // Get category ID from route parameters
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      
      // Get category name from navigation service if available
      const storedCategoryName = this.navigationService.getCategoryName();
      if (storedCategoryName) {
        this.categoryName = storedCategoryName;
      }
      
      // If we don't have the category name yet, we can fetch it using the ID
      if (!this.categoryName && this.categoryId) {
        this.fetchCategoryDetails(this.categoryId);
      }
      
      // Load subcategories for this category
      this.loadSubcategories();
      
      // Load all products from this category
      this.loadCategoryProducts();
    });

  
   
  }

  fetchCategoryDetails(categoryId: string): void {
    this.productService.getCategoryById(categoryId).subscribe(
      (response: any) => {
        // Handle the API response format
        if (response && response.success && response.data) {
          this.categoryName = response.data.name;
        } else {
          this.categoryName = 'Category ' + categoryId;
        }
      },
      (err) => {
        console.error('Error fetching category details', err);
        this.categoryName = 'Category ' + categoryId;
      }
    );
  }

  loadSubcategories(): void {
    this.productService.getSubcategoriesByCategoryId(this.categoryId).subscribe(
      (response: any) => {
        console.log('Subcategories response:', response);
        
        // Handle the API response format
        if (response && response.success && Array.isArray(response.data)) {
          this.subcategories = response.data;
        } else {
          console.error('Unexpected API response format for subcategories:', response);
          this.subcategories = [];
        }
      },
      (err) => {
        console.error('Error loading subcategories', err);
        this.subcategories = [];
      }
    );
  }

  loadCategoryProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProductsByCategory(this.categoryId).subscribe(
      (response: any) => {
        console.log('API response data for category products:', response);
        
        // Handle the API response format
        if (response && response.success && response.data && response.data.products) {
          this.products = response.data.products;
          this.totalItems = response.data.totalItems || this.products.length;
        } else {
          console.error('Unexpected API response format for products:', response);
          this.error = 'Invalid data format received from API';
          this.products = [];
        }
        
        // Initially show all products
        this.filteredProducts = [...this.products];
        this.updatePagination();
        this.loading = false;
      },
      (err) => {
        console.error('Error loading products', err);
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
        this.products = [];
        this.filteredProducts = [];
      }
    );
  }

  filterBySubcategory(subcategoryId: string): void {
    this.selectedSubcategoryId = subcategoryId;
    this.loading = true;
    this.error = null;
    
    if (!subcategoryId) {
      // If no subcategory selected, show all products
      this.filteredProducts = [...this.products];
      this.updatePagination();
      this.loading = false;
      return;
    }
    
    // Get products specifically for this subcategory
    this.productService.getProductsBySubcategory(subcategoryId).subscribe(
      (response: any) => {
        console.log('Subcategory products response:', response);
        
        // Check different possible response formats
        if (response && response.data && response.data.products) {
          // Format 1: { data: { products: [...] } }
          this.filteredProducts = response.data.products;
          this.totalItems = response.data.totalItems || this.filteredProducts.length;
        } else if (response && response.products) {
          // Format 2: { products: [...] }
          this.filteredProducts = response.products;
          this.totalItems = response.totalItems || this.filteredProducts.length;
        } else if (response && Array.isArray(response)) {
          // Format 3: Direct array
          this.filteredProducts = response;
          this.totalItems = this.filteredProducts.length;
        } else {
          console.error('Unexpected API response format for subcategory products:', response);
          this.error = 'Invalid data format received from API';
          this.filteredProducts = [];
        }
        
        // Reset to first page when filtering
        this.currentPage = 1;
        this.updatePagination();
        this.loading = false;
      },
      (err) => {
        console.error('Error loading subcategory products', err);
        this.error = 'Failed to load subcategory products. Please try again.';
        this.loading = false;
        this.filteredProducts = [];
      }
    );
  }

  // Reset filters and show all products
  showAllProducts(): void {
    this.selectedSubcategoryId = '';
    this.filteredProducts = [...this.products];
    this.currentPage = 1;
    this.updatePagination();
  }

  // Method to navigate to product details
  navigateToProductDetails(productId: number): void {
    this.router.navigate(['/Products', productId]);
  }

  // Pagination methods
  updatePagination(): void {
    this.totalItems = this.filteredProducts.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.updateDisplayedProducts();
    this.generatePageNumbers();
    
  }

  updateDisplayedProducts(): void {
    window.scrollTo(0, 0);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalItems);
    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  generatePageNumbers(): void {
    this.pages = [];
    const totalVisiblePages = 5; // Show 5 page numbers at a time

    if (this.totalPages <= totalVisiblePages) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= this.totalPages; i++) {
        this.pages.push(i);
      }
    } else {
      // Always show first page
      this.pages.push(1);

      // Calculate the range of pages to show around current page
      let startPage = Math.max(2, this.currentPage - 1);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);

      // Adjust if we're near the beginning
      if (this.currentPage <= 3) {
        endPage = Math.min(4, this.totalPages - 1);
      }

      // Adjust if we're near the end
      if (this.currentPage >= this.totalPages - 2) {
        startPage = Math.max(2, this.totalPages - 3);
      }

      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        this.pages.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        this.pages.push(i);
      }

      // Add ellipsis if needed after middle pages
      if (endPage < this.totalPages - 1) {
        this.pages.push(-2); // -2 represents ellipsis
      }

      // Always show last page
      this.pages.push(this.totalPages);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updateDisplayedProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProducts();
    }
  }

  override getFullImageUrl(relativePath: string): string {
    if (!relativePath) return 'assets/images/placeholder-product.png';
    if (relativePath.startsWith('http')) return relativePath;
    return `${environment.apiUrl}/${relativePath}`;
  }

  // Wishlist functionality
  loadWishlistItems(): void {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        this.wishlistItems = JSON.parse(savedWishlist);
      } catch (e) {
        console.error('Error parsing wishlist from localStorage', e);
        this.wishlistItems = [];
      }
    }
  }
  
  saveWishlistItems(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
  }
  
  isInWishlist(productId: number): boolean {
    return this.wishlistItems.includes(productId);
  }
  
  toggleWishlist(event: Event, productId: number): void {
    event.stopPropagation(); // Prevent navigation to product details
    
    const index = this.wishlistItems.indexOf(productId);
    if (index === -1) {
      // Add to wishlist
      this.wishlistItems.push(productId);
    } else {
      // Remove from wishlist
      this.wishlistItems.splice(index, 1);
    }
    
    this.saveWishlistItems();
  }
  
  // Cart functionality
  addToCart(event: Event, productId: number): void {
    event.stopPropagation(); // Prevent navigation to product details
    
    // Here you would typically call a cart service to add the product
    // For demonstration, we'll just log to console
    console.log(`Adding product ${productId} to cart`);
    
    // Add your cart service logic here
    // For example:
    // this.cartService.addToCart(productId, 1);
    
    // Show user feedback
    alert('Product added to cart!');
  }

 
  
}