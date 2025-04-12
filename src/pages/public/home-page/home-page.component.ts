// src/app/pages/public/home-page/home-page.component.ts
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-home-page',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div class="container">
//       <h1>Welcome to Jumia Clone</h1>
//       <p>This is the home page.</p>
//     </div>
//   `,
//   styles: [`
//     .container {
//       padding: 20px;
//       max-width: 1200px;
//       margin: 0 auto;
//     }
//   `]
// })
// export class HomePageComponent {}


// pages/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
import { CarouselComponent } from '../../../shared/carousel/carousel.component';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';
import { CategoryCardComponent } from '../../../shared/category-card/category-card.component';
import { BannerComponent } from '../../../shared/banner/banner.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CarouselComponent,
    ProductCardComponent,
    CategoryCardComponent,
    BannerComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  topDeals: Product[] = [];
  categories: Category[] = [];
  banners: {image: string, link: string}[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Load categories from API
    this.fetchCategories();
    
    // Mock data for products - in a real app, these would come from a service
    this.featuredProducts = [
      { id: 1, name: 'Samsung Galaxy A24', price: 499.99, oldPrice: 599.99, discount: 17, image: 'assets/images/products/phone1.jpg', category: 'Electronics', rating: 4.5, inStock: true, freeShipping: true },
      { id: 2, name: 'Men\'s Casual T-Shirt', price: 19.99, oldPrice: 29.99, discount: 33, image: 'assets/images/products/tshirt1.jpg', category: 'Fashion', rating: 4.2, inStock: true },
      { id: 3, name: 'Wireless Bluetooth Headphones', price: 79.99, oldPrice: 99.99, discount: 20, image: 'assets/images/products/headphones1.jpg', category: 'Electronics', rating: 4.7, inStock: true, freeShipping: true },
      { id: 4, name: 'Non-stick Cooking Pan', price: 24.99, oldPrice: 34.99, discount: 29, image: 'assets/images/products/pan1.jpg', category: 'Home & Office', rating: 4.0, inStock: true }
    ];

    this.topDeals = [
      { id: 5, name: 'Smart LED TV 43"', price: 299.99, oldPrice: 399.99, discount: 25, image: 'assets/images/products/tv1.jpg', category: 'Electronics', rating: 4.6, inStock: true, freeShipping: true },
      { id: 6, name: 'Women\'s Running Shoes', price: 49.99, oldPrice: 69.99, discount: 29, image: 'assets/images/products/shoes1.jpg', category: 'Fashion', rating: 4.3, inStock: true },
      { id: 7, name: 'Electric Blender', price: 39.99, oldPrice: 59.99, discount: 33, image: 'assets/images/products/blender1.jpg', category: 'Home & Office', rating: 4.4, inStock: true },
      { id: 8, name: 'Skin Care Set', price: 44.99, oldPrice: 59.99, discount: 25, image: 'assets/images/products/skincare1.jpg', category: 'Health & Beauty', rating: 4.8, inStock: true }
    ];

    this.banners = [
      { image: 'assets/images/banners/banner1.jpg', link: '/promotions/sale' },
      { image: 'assets/images/banners/banner2.jpg', link: '/category/electronics' },
      { image: 'assets/images/banners/banner3.jpg', link: '/flash-sale' }
    ];
  }

  fetchCategories(): void {
    this.isLoading = true;
    this.http.get<{success: boolean, message: string, data: Category[]}>('api/categories')
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Filter only active categories
            this.categories = response.data.filter(category => category.isActive);
            this.isLoading = false;
          } else {
            this.errorMessage = response.message;
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.errorMessage = 'Failed to load categories. Please try again later.';
          this.isLoading = false;
          console.error('Error fetching categories:', error);
          
          // Fallback to mock data for development purposes
          this.loadMockCategories();
        }
      });
  }

  loadMockCategories(): void {
    // Mock data for categories in case API fails
    this.categories = [
      { 
        categoryId: 1, 
        name: 'Supermarket', 
        description: 'Groceries and daily needs', 
        imageUrl: 'assets/images/categories/supermarket.png', 
        isActive: true, 
        subcategoryCount: 8 
      },
      { 
        categoryId: 2, 
        name: 'Fashion', 
        description: 'Clothing, shoes and accessories', 
        imageUrl: 'assets/images/categories/fashion.png', 
        isActive: true, 
        subcategoryCount: 12 
      },
      { 
        categoryId: 3, 
        name: 'Electronics', 
        description: 'TVs, audio, cameras and more', 
        imageUrl: 'assets/images/categories/electronics.png', 
        isActive: true, 
        subcategoryCount: 10 
      },
      { 
        categoryId: 4, 
        name: 'Phones & Tablets', 
        description: 'Mobile phones and accessories', 
        imageUrl: 'assets/images/categories/phones.png', 
        isActive: true, 
        subcategoryCount: 6 
      },
      { 
        categoryId: 5, 
        name: 'Home & Office', 
        description: 'Furniture and home appliances', 
        imageUrl: 'assets/images/categories/home.png', 
        isActive: true, 
        subcategoryCount: 15 
      },
      { 
        categoryId: 6, 
        name: 'Health & Beauty', 
        description: 'Personal care and wellness products', 
        imageUrl: 'assets/images/categories/beauty.png', 
        isActive: true, 
        subcategoryCount: 9 
      }
    ];
  }
}