import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
import { CarouselComponent } from '../../../shared/carousel/carousel.component';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';
import { CategoryCardComponent } from '../../../shared/category-card/category-card.component';
import { BannerComponent } from '../../../shared/banner/banner.component';
import { HttpClient } from '@angular/common/http';
import { PromoSliderComponent } from "./homeComponents/promoSlider/promo-slider.component";
import { StaticContainerComponent } from "./homeComponents/static-container/static-container.component";
import { CenterSliderComponent } from "./homeComponents/center-slider/center-slider.component";
import { TwoImagesBannarComponent } from "./homeComponents/twoImagesBannar/two-images-bannar/two-images-bannar.component";
import { FlashSalesBannerComponent } from "./homeComponents/flashSaleBannar/components/flash-sales-bannar/flash-sales-bannar.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CarouselComponent,
    ProductCardComponent,
    CategoryCardComponent,
    BannerComponent,
    PromoSliderComponent,
    StaticContainerComponent,
    CenterSliderComponent,
    TwoImagesBannarComponent,
    FlashSalesBannerComponent
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
  
  // Easter Sale banner data
  easterSaleBanner = {
    title: 'EASTER SALE',
    startingPrice: '35 EGP',
    brands: ['Parkville', 'Seropipe', 'GlamyLab', 'Clary', 'Borai'],
    features: ['Free Shipping', 'Wide Assortment'],
    products: [
      { name: 'StrongVille Nourishing Cream', image: 'assets/images/products/strongville-cream.png' },
      { name: 'GlamyLab Eye Contour', image: 'assets/images/products/glamylab-eye-contour.png' }
    ]
  };
  
  
  // Side menu categories
  sidebarCategories = [
    { name: 'Fashion', icon: 'fashion-icon' },
    { name: 'Phones & Tablets', icon: 'phone-icon' },
    { name: 'Health & Beauty', icon: 'health-icon' },
    { name: 'Home & Furniture', icon: 'home-icon' },
    { name: 'Appliances', icon: 'appliance-icon' },
    { name: 'Televisions & Audio', icon: 'tv-icon' },
    { name: 'Baby Products', icon: 'baby-icon' },
    { name: 'Supermarket', icon: 'supermarket-icon' },
    { name: 'Computing', icon: 'computing-icon' },
    { name: 'Sporting Goods', icon: 'sporting-icon' },
    { name: 'Gaming', icon: 'gaming-icon' },
    { name: 'Other categories', icon: 'other-icon' }
  ];
  
  // Right sidebar options
  sidebarOptions = [
    { 
      title: 'Join Jumia', 
      subtitle: 'as a Sales Consultant', 
      icon: 'star-icon' 
    },
    { 
      title: 'Sell on JUMIA', 
      subtitle: 'And Grow Your Business', 
      icon: 'money-icon' 
    },
    { 
      title: 'Warranty', 
      subtitle: 'On Your Purchases', 
      icon: 'warranty-icon' 
    }
  ];

  
  
  // Main banner carousel current slide index
  currentSlide: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Load categories from API
    this.fetchCategories();
    
    // Mock data for products - in a real app, these would come from a service
    this.featuredProducts = [
      {
        product_id: 1,
        name: 'Samsung Galaxy A24',
        base_price: 599.99,
        discount_percentage: 17,
        final_price: 499.99,
        average_rating: 4.5,
        main_image_url: 'assets/images/products/phone1.jpg',
        seller: {
          seller_id: 101,
          business_name: 'Samsung Official Store'
        },
        subcategory: {
          subcategory_id: 5,
          name: 'Electronics'
        }
      },
      {
        product_id: 2,
        name: 'Men\'s Casual T-Shirt',
        base_price: 29.99,
        discount_percentage: 33,
        final_price: 19.99,
        average_rating: 4.2,
        main_image_url: 'assets/images/products/tshirt1.jpg',
        seller: {
          seller_id: 102,
          business_name: 'FashionHub'
        },
        subcategory: {
          subcategory_id: 10,
          name: 'Fashion'
        }
      },
      {
        product_id: 3,
        name: 'Wireless Bluetooth Headphones',
        base_price: 99.99,
        discount_percentage: 20,
        final_price: 79.99,
        average_rating: 4.7,
        main_image_url: 'assets/images/products/headphones1.jpg',
        seller: {
          seller_id: 103,
          business_name: 'AudioTech'
        },
        subcategory: {
          subcategory_id: 5,
          name: 'Electronics'
        }
      },
      {
        product_id: 4,
        name: 'Non-stick Cooking Pan',
        base_price: 34.99,
        discount_percentage: 29,
        final_price: 24.99,
        average_rating: 4.0,
        main_image_url: 'assets/images/products/pan1.jpg',
        seller: {
          seller_id: 104,
          business_name: 'KitchenPlus'
        },
        subcategory: {
          subcategory_id: 15,
          name: 'Home & Office'
        }
      },
      {
        product_id: 5,
        name: 'Non-stick Cooking Pan',
        base_price: 34.99,
        discount_percentage: 29,
        final_price: 24.99,
        average_rating: 4.0,
        main_image_url: 'assets/images/products/pan1.jpg',
        seller: {
          seller_id: 104,
          business_name: 'KitchenPlus'
        },
        subcategory: {
          subcategory_id: 15,
          name: 'Home & Office'
        }
      },
      {
        product_id: 6,
        name: 'Non-stick Cooking Pan',
        base_price: 34.99,
        discount_percentage: 29,
        final_price: 24.99,
        average_rating: 4.0,
        main_image_url: 'assets/images/products/pan1.jpg',
        seller: {
          seller_id: 104,
          business_name: 'KitchenPlus'
        },
        subcategory: {
          subcategory_id: 15,
          name: 'Home & Office'
        }
      }
    ];

    this.topDeals = [
      {
        product_id: 5,
        name: 'Smart LED TV 43"',
        base_price: 399.99,
        discount_percentage: 25,
        final_price: 299.99,
        average_rating: 4.6,
        main_image_url: 'assets/images/products/tv1.jpg',
        seller: {
          seller_id: 105,
          business_name: 'ElectroWorld'
        },
        subcategory: {
          subcategory_id: 5,
          name: 'Electronics'
        }
      },
      {
        product_id: 6,
        name: 'Women\'s Running Shoes',
        base_price: 69.99,
        discount_percentage: 29,
        final_price: 49.99,
        average_rating: 4.3,
        main_image_url: 'assets/images/products/shoes1.jpg',
        seller: {
          seller_id: 102,
          business_name: 'FashionHub'
        },
        subcategory: {
          subcategory_id: 10,
          name: 'Fashion'
        }
      },
      {
        product_id: 7,
        name: 'Electric Blender',
        base_price: 59.99,
        discount_percentage: 33,
        final_price: 39.99,
        average_rating: 4.4,
        main_image_url: 'assets/images/products/blender1.jpg',
        seller: {
          seller_id: 104,
          business_name: 'KitchenPlus'
        },
        subcategory: {
          subcategory_id: 15,
          name: 'Home & Office'
        }
      },
      {
        product_id: 8,
        name: 'Skin Care Set',
        base_price: 59.99,
        discount_percentage: 25,
        final_price: 44.99,
        average_rating: 4.8,
        main_image_url: 'assets/images/products/skincare1.jpg',
        seller: {
          seller_id: 106,
          business_name: 'BeautyEssentials'
        },
        subcategory: {
          subcategory_id: 20,
          name: 'Health & Beauty'
        }
      }
    ];
    
    this.banners = [
      { image: 'assets/images/banners/banner1.jpg', link: '/promotions/sale' },
      { image: 'assets/images/banners/banner2.jpg', link: '/category/electronics' },
      { image: 'assets/images/banners/banner3.jpg', link: '/flash-sale' }
    ];
    
    // Start automatic banner slider
    this.startSlideShow();
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
  
  startSlideShow(): void {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % 7; // Assuming 7 slides based on the dots in the UI
    }, 5000); // Change slide every 5 seconds
  }

  setCurrentSlide(index: number): void {
    this.currentSlide = index;
  }
}