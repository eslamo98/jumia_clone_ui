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

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule, ComputingContainerComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  category: any;
  categoryId: string = '';
  categoryName: string = '';
  subcategories: any[] = [];
  products: any[] = [];
  selectedSubcategory: any = null;
  loading = true; // Set loading to true initially
  error: string | null = null;
  selectedSubcategoryId: string | null = null;
  
  // For pagination if needed
  currentPage = 1;
  pageSize = 20;
  totalItems = 0;
  Math = Math; // Add Math to be used in template

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService,
    private navigationService: NavigationService
  ) { }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = params['categoryId'];
  
      this.loadCategoryById(this.categoryId);
      this.loadSubcategories(this.categoryId);
      this.loadProductsByCategory(this.categoryId); 
    });

    
    console.log('Category component initialized');
    this.route.paramMap.subscribe(params => {
      const categoryId = params.get('id');
      const subcategoryId = params.get('subcategoryId'); // If your route supports this
      console.log('Route param categoryId:', categoryId);
      console.log('Route param subcategoryId:', subcategoryId);
      
      if (categoryId) {
        this.categoryId = categoryId;
        
        // If we have a subcategoryId in the URL, use it
        if (subcategoryId) {
          this.loadCategoryById(categoryId);
          // Pre-select this subcategory
          this.selectedSubcategory = { id: subcategoryId };
          this.loadProductsBySubcategory(subcategoryId);
        } else {
          // Check if we have a stored subcategoryId in the navigation service
          const storedSubcategoryId = this.navigationService.getSubcategoryId();
          if (storedSubcategoryId) {
            this.loadCategoryById(categoryId);
            this.selectedSubcategory = { id: storedSubcategoryId };
            this.loadProductsBySubcategory(storedSubcategoryId);
          } else {
            // Normal flow - load category and its subcategories
            this.loadCategoryById(categoryId);
          }
        }
      }
    });
  }

  /**
   * Load category information by ID
   * This method fetches the category details and then loads subcategories
   */
  loadCategoryById(categoryId: string): void {
    this.loading = true;
    this.error = null;
    console.log('Loading category by ID:', categoryId);
    
    this.categoryService.getCategoryById(categoryId).subscribe({
      next: (category) => {
        console.log('Category data received:', category);
        this.category = category;
        this.categoryName = category.name;
        this.loadSubcategories(categoryId);
      },
      error: (err) => {
        console.error('Error loading category details:', err);
        this.error = 'Failed to load category details. Please try again.';
        this.loading = false;
        // Try loading products directly as fallback
        this.loadProductsByCategory(categoryId);
      }
    });
  }

  /**
   * Load subcategories for a given category
   * If subcategories exist, load products from the first subcategory
   * Otherwise, load products directly from the category
   */



  /**
   * Load all products that belong to a specific category
   * This method handles different possible response formats from the API
   */
  loadProductsByCategory(categoryId: string): void {
    this.selectedSubcategoryId = null; // عشان زر "All" يبان Active
    this.loading = true;
    this.error = null;
  
    this.productService.getProductsByCategory(categoryId, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.products = data.products || [];
        this.totalItems = data.totalItems || this.products.length;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products.';
        this.loading = false;
      }
    });
  }
  

  /**
   * Load products that belong to a specific subcategory
   * This uses the same API endpoint as loadProductsByCategory but with subcategory ID
   */
  loadProductsBySubcategory(subcategoryId: string): void {
    this.selectedSubcategoryId = subcategoryId;
    this.loading = true;
    this.error = null;
  
    this.productService.getProductsBySubcategory(subcategoryId, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.products = data.products || [];
        this.totalItems = data.totalItems || this.products.length;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load subcategory products.';
        this.loading = false;
      }
    });
  }
  
  /**
   * Handle subcategory selection from UI
   * Updates selected subcategory and loads its products
   */
  selectSubcategory(subcategory: any): void {
    console.log('Selecting subcategory:', subcategory);
    this.selectedSubcategory = subcategory;
    this.loadProductsBySubcategory(subcategory.id);
  }

  loadSubcategories(categoryId: string): void {
    this.categoryService.getSubcategoriesByCategory(categoryId).subscribe({
      next: (subcategories) => {
        this.subcategories = subcategories || [];
      },
      error: () => {
        this.error = 'Failed to load subcategories.';
      }
    });
  }

  /**
   * Convert relative image paths to full URLs
   * Handles missing images and already full URLs
   */
  getFullImageUrl(relativePath: string): string {
    if (!relativePath) return 'assets/images/placeholder-product.png';
    if (relativePath.startsWith('http')) return relativePath;
    return `${environment.apiUrl}/${relativePath}`;
  }

  /**
   * Navigate to product details page
   */
  navigateToProductDetails(productId: number): void {
    console.log('Navigating to product details:', productId);
    this.router.navigate(['/Products', productId]);
  }

  /**
   * Change the current page for pagination
   * Prevents navigation to non-existent pages
   */
  changePage(pageNumber: number): void {
    console.log('Changing page to:', pageNumber);
    if (pageNumber < 1 || pageNumber > Math.ceil(this.totalItems / this.pageSize)) {
      return; // Prevent navigation to non-existent pages
    }
    this.currentPage = pageNumber;
    
    // Update products based on new page number
    if (this.selectedSubcategory) {
      this.loadProductsBySubcategory(this.selectedSubcategory.id);
    } else {
      this.loadProductsByCategory(this.categoryId);
    }
    
    // Scroll to top of page for better experience
    window.scrollTo(0, 0);
  }

  /**
   * Create an array of page numbers for pagination UI
   * Shows maximum 5 page numbers around the current page
   */
  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    const currentPage = this.currentPage;
    
    // Show maximum 5 page numbers
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}