// src/app/services/admin.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Category, DashboardStats, Order, Product, ProductQueryParams, Review, Seller, User } from '../../models/admin';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginationParams } from '../../models/general';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  apiUrl = environment.apiUrl;
  // Mock data for dashboard stats
  private mockDashboardStats: DashboardStats = {
    revenue: 2567890,
    revenueChange: 12.5,
    orders: 3254,
    ordersChange: 8.3,
    customers: 15678,
    customersChange: 5.7,
    products: 4567,
    productsChange: -2.1,
    recentOrders: [],
    topProducts: []
  };

  // Mock products data
  private mockProducts: Product[] = [
    ...this.mockDashboardStats.topProducts,
   
  ];

  // Mock categories data
  private mockCategories: Category[] = [
   
  ];

  // Mock orders data
  private mockOrders: Order[] = [
    ...this.mockDashboardStats.recentOrders,

  ];

  // Mock users data (customers)
  private mockCustomers: User[] = [
    
  ];

  // Mock sellers data
  private mockSellers: Seller[] = [
    
  ];

  // Mock reviews data
  private mockReviews: Review[] = [
    {
      id: 'REV-1',
      productId: 'PROD-1',
      productName: 'Smartphone X',
      customerId: 'CUST-2',
      customerName: 'Jane Smith',
      rating: 5,
      comment: 'Amazing phone with great battery life and camera quality!',
      createdAt: new Date(2025, 3, 5),
      status: 'approved'
    },
    {
      id: 'REV-2',
      productId: 'PROD-1',
      productName: 'Smartphone X',
      customerId: 'CUST-3',
      customerName: 'Michael Johnson',
      rating: 4,
      comment: 'Good phone but heats up a bit when playing games.',
      createdAt: new Date(2025, 3, 6),
      status: 'approved',
      response: {
        sellerId: 'SEL-1',
        sellerName: 'TechHub',
        comment: 'Thank you for your feedback. We recommend lowering graphic settings for intensive games.',
        createdAt: new Date(2025, 3, 7)
      }
    },
    {
      id: 'REV-3',
      productId: 'PROD-3',
      productName: 'Laptop Pro',
      customerId: 'CUST-4',
      customerName: 'Sarah Williams',
      rating: 5,
      comment: 'Perfect laptop for work and entertainment. Fast performance and beautiful display!',
      createdAt: new Date(2025, 3, 8),
      status: 'approved'
    },
    {
      id: 'REV-4',
      productId: 'PROD-4',
      productName: 'Wireless Earbuds',
      customerId: 'CUST-1',
      customerName: 'John Doe',
      rating: 4,
      comment: 'Great sound quality and comfortable fit. Battery could be better though.',
      createdAt: new Date(2025, 3, 9),
      status: 'approved'
    },
    {
      id: 'REV-5',
      productId: 'PROD-6',
      productName: 'Smart TV 43"',
      customerId: 'CUST-5',
      customerName: 'David Brown',
      rating: 3,
      comment: 'Good TV but the smart features are a bit slow sometimes.',
      createdAt: new Date(2025, 3, 10),
      status: 'approved',
      response: {
        sellerId: 'SEL-3',
        sellerName: 'HomeElectronics',
        comment: 'We appreciate your feedback. Try updating the firmware for improved performance.',
        createdAt: new Date(2025, 3, 11)
      }
    },
    {
      id: 'REV-6',
      productId: 'PROD-7',
      productName: 'Gaming Console',
      customerId: 'CUST-2',
      customerName: 'Jane Smith',
      rating: 5,
      comment: 'Best gaming experience ever! Fast loading times and amazing graphics.',
      createdAt: new Date(2025, 3, 12),
      status: 'pending'
    }
  ];

  constructor(private http: HttpClient) { }

  // Dashboard methods
  getDashboardStats(): Observable<DashboardStats> {
    // Simulate API call with delay
    return of(this.mockDashboardStats).pipe(delay(800));
  }

  // Product methods
  getProducts(params: ProductQueryParams): Observable<Product[]> {
    let httpParams = new HttpParams()
      .set('PageSize', params.pageSize.toString())
      .set('PageNumber', params.pageNumber.toString());
  
    if (params.categoryId !== undefined) {
      httpParams = httpParams.set('CategoryId', params.categoryId.toString());
    }
    if (params.subcategoryId !== undefined) {
      httpParams = httpParams.set('SubcategoryId', params.subcategoryId.toString());
    }
    if (params.sellerId !== undefined) {
      httpParams = httpParams.set('SellerId', params.sellerId.toString());
    }
    if (params.minPrice !== undefined) {
      httpParams = httpParams.set('MinPrice', params.minPrice.toString());
    }
    if (params.maxPrice !== undefined) {
      httpParams = httpParams.set('MaxPrice', params.maxPrice.toString());
    }
    if (params.searchTerm) {
      httpParams = httpParams.set('SearchTerm', params.searchTerm);
    }
    if (params.approvalStatus) {
      httpParams = httpParams.set('ApprovalStatus', params.approvalStatus);
    }
    if (params.sortBy) {
      httpParams = httpParams.set('SortBy', params.sortBy);
    }
    if (params.sortDirection) {
      httpParams = httpParams.set('SortDirection', params.sortDirection);
    }
  
    return this.http.get<Product[]>(`${this.apiUrl}/api/Products`, { params: httpParams });
  }
  

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.productId === id);
    return of(product).pipe(delay(500));
  }

  createProduct(product: Omit<Product, 'prouctId' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    const newProduct: Product = {
      ...product,
      productId: this.mockProducts.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // In a real application, we would add to the array
    // this.mockProducts.push(newProduct);
    
    return of(newProduct).pipe(delay(800));
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    const index = this.mockProducts.findIndex(p => p.productId === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    const updatedProduct: Product = {
      ...this.mockProducts[index],
      ...product,
      updatedAt: new Date().toISOString()
    };
    
    // In a real application, we would update the array
    // this.mockProducts[index] = updatedProduct;
    
    return of(updatedProduct).pipe(delay(800));
  }

  deleteProduct(id: number): Observable<boolean> {
    const index = this.mockProducts.findIndex(p => p.productId === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    // In a real application, we would remove from the array
    // this.mockProducts.splice(index, 1);
    
    return of(true).pipe(delay(800));
  }

  // Category methods
  getCategories(): Observable<Category[]> {
    return of(this.mockCategories).pipe(delay(800));
  }

  getCategoryById(id: number): Observable<Category | undefined> {
    const category = this.mockCategories.find(c => c.id === id);
    return of(category).pipe(delay(500));
  }

  createCategory(category: Omit<Category, 'id'>): Observable<Category> {
    const newCategory: Category = {
      ...category,
      id: this.mockCategories.length + 1
    };
    
    // In a real application, we would add to the array
    // this.mockCategories.push(newCategory);
    
    return of(newCategory).pipe(delay(800));
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    const updatedCategory: Category = {
      ...this.mockCategories[index],
      ...category
    };
    
    // In a real application, we would update the array
    // this.mockCategories[index] = updatedCategory;
    
    return of(updatedCategory).pipe(delay(800));
  }

  deleteCategory(id: number): Observable<boolean> {
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    // In a real application, we would remove from the array
    // this.mockCategories.splice(index, 1);
    
    return of(true).pipe(delay(800));
  }

  // Order methods
  getOrders(filters?: any): Observable<Order[]> {
    // TODO: Implement filtering logic
    return of(this.mockOrders).pipe(delay(800));
  }

  getOrderById(id: number): Observable<Order | undefined> {
    const order = this.mockOrders.find(o => o.id === id);
    return of(order).pipe(delay(500));
  }

  updateOrderStatus(id: number, status: Order['status']): Observable<Order> {
    const index = this.mockOrders.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    const updatedOrder: Order = {
      ...this.mockOrders[index],
      status
    };
    
    // In a real application, we would update the array
    // this.mockOrders[index] = updatedOrder;
    
    return of(updatedOrder).pipe(delay(800));
  }

  // Customer methods
  getCustomers(filters?: any): Observable<User[]> {
    // TODO: Implement filtering logic
    return of(this.mockCustomers).pipe(delay(800));
  }

  getCustomerById(id: number): Observable<User | undefined> {
    const customer = this.mockCustomers.find(c => c.id === id);
    return of(customer).pipe(delay(500));
  }

  updateCustomerStatus(id: number, status: User['status']): Observable<User> {
    const index = this.mockCustomers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    const updatedCustomer: User = {
      ...this.mockCustomers[index],
      status
    };
    
    // In a real application, we would update the array
    // this.mockCustomers[index] = updatedCustomer;
    
    return of(updatedCustomer).pipe(delay(800));
  }

  // Seller methods
  getSellers(filters?: any): Observable<Seller[]> {
    // TODO: Implement filtering logic
    return of(this.mockSellers).pipe(delay(800));
  }

  getSellerById(id: number): Observable<Seller | undefined> {
    const seller = this.mockSellers.find(s => s.id === id);
    return of(seller).pipe(delay(500));
  }

  updateSellerStatus(id: number, status: Seller['status']): Observable<Seller> {
    const index = this.mockSellers.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Seller not found');
    }
    
    const updatedSeller: Seller = {
      ...this.mockSellers[index],
      status
    };
    
    return of(updatedSeller).pipe(delay(800));
  }

  updateSellerVerification(id: number, status: Seller['verificationStatus'], rejectionReason?: string): Observable<Seller> {
    const index = this.mockSellers.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Seller not found');
    }
    
    const updatedSeller: Seller = {
      ...this.mockSellers[index],
      verificationStatus: status,
      rejectionReason: status === 'rejected' ? rejectionReason : undefined
    };
    
    // In a real application, we would update the array
    // this.mockSellers[index] = updatedSeller;
    
    return of(updatedSeller).pipe(delay(800));
  }

  // Review methods
  getReviews(filters?: any): Observable<Review[]> {
    // TODO: Implement filtering logic
    return of(this.mockReviews).pipe(delay(800));
  }

  getReviewById(id: string): Observable<Review | undefined> {
    const review = this.mockReviews.find(r => r.id === id);
    return of(review).pipe(delay(500));
  }

  updateReviewStatus(id: string, status: Review['status']): Observable<Review> {
    const index = this.mockReviews.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Review not found');
    }
    
    const updatedReview: Review = {
      ...this.mockReviews[index],
      status
    };
    
    // In a real application, we would update the array
    // this.mockReviews[index] = updatedReview;
    
    return of(updatedReview).pipe(delay(800));
  }

  // Analytics methods
  getSalesAnalytics(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Observable<any> {
    // Mock analytics data based on period
    const today = new Date();
    const data: any[] = [];
    
    if (period === 'daily') {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          sales: Math.floor(Math.random() * 500000) + 50000,
          orders: Math.floor(Math.random() * 100) + 10
        });
      }
    } else if (period === 'weekly') {
      // Last 12 weeks
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (i * 7));
        data.push({
          week: `Week ${12 - i}`,
          sales: Math.floor(Math.random() * 3000000) + 300000,
          orders: Math.floor(Math.random() * 500) + 50
        });
      }
    } else if (period === 'monthly') {
      // Last 12 months
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        const monthIndex = date.getMonth();
        data.push({
          month: monthNames[monthIndex],
          sales: Math.floor(Math.random() * 10000000) + 1000000,
          orders: Math.floor(Math.random() * 2000) + 200
        });
      }
    } else if (period === 'yearly') {
      // Last 5 years
      const currentYear = today.getFullYear();
      for (let i = 4; i >= 0; i--) {
        const year = currentYear - i;
        data.push({
          year: year.toString(),
          sales: Math.floor(Math.random() * 100000000) + 10000000,
          orders: Math.floor(Math.random() * 20000) + 2000
        });
      }
    }
    
    return of({ period, data }).pipe(delay(1000));
  }

  getTopSellingCategories(): Observable<any[]> {
    const topCategories = this.mockCategories.map(category => ({
      id: category.id,
      name: category.name,
      sales: Math.floor(Math.random() * 5000000) + 500000,
      percentage: Math.floor(Math.random() * 30) + 5
    })).sort((a, b) => b.sales - a.sales).slice(0, 5);
    
    return of(topCategories).pipe(delay(800));
  }

  getTopSellingSellers(): Observable<any[]> {
    const topSellers = this.mockSellers.map(seller => ({
      id: seller.id,
      name: seller.storeName,
      sales: Math.floor(Math.random() * 5000000) + 500000,
      orders: Math.floor(Math.random() * 1000) + 100
    })).sort((a, b) => b.sales - a.sales).slice(0, 5);
    
    return of(topSellers).pipe(delay(800));
  }
}