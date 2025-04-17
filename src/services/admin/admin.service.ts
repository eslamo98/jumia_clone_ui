// src/app/services/admin.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Category, DashboardStats, Order, Product, Review, Seller, User } from '../../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
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
    recentOrders: [
      {
        id: 'ORD-12345',
        customerName: 'John Doe',
        customerId: 'CUST-1',
        date: new Date(2025, 3, 13),
        amount: 24500,
        status: 'completed',
        items: [
          { productId: 'PROD-1', productName: 'Smartphone X', quantity: 1, price: 15000 },
          { productId: 'PROD-2', productName: 'Phone Case', quantity: 2, price: 2000 }
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'Lagos',
          state: 'Lagos',
          zipCode: '100001',
          country: 'Nigeria'
        },
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid'
      },
      {
        id: 'ORD-12346',
        customerName: 'Jane Smith',
        customerId: 'CUST-2',
        date: new Date(2025, 3, 13),
        amount: 35000,
        status: 'processing',
        items: [
          { productId: 'PROD-3', productName: 'Laptop Pro', quantity: 1, price: 35000 }
        ],
        shippingAddress: {
          street: '456 Park Ave',
          city: 'Abuja',
          state: 'FCT',
          zipCode: '900001',
          country: 'Nigeria'
        },
        paymentMethod: 'Bank Transfer',
        paymentStatus: 'paid'
      },
      {
        id: 'ORD-12347',
        customerName: 'Michael Johnson',
        customerId: 'CUST-3',
        date: new Date(2025, 3, 12),
        amount: 9500,
        status: 'pending',
        items: [
          { productId: 'PROD-4', productName: 'Wireless Earbuds', quantity: 1, price: 8000 },
          { productId: 'PROD-5', productName: 'Screen Protector', quantity: 1, price: 1500 }
        ],
        shippingAddress: {
          street: '789 River Rd',
          city: 'Port Harcourt',
          state: 'Rivers',
          zipCode: '500001',
          country: 'Nigeria'
        },
        paymentMethod: 'PayPal',
        paymentStatus: 'pending'
      },
      {
        id: 'ORD-12348',
        customerName: 'Sarah Williams',
        customerId: 'CUST-4',
        date: new Date(2025, 3, 12),
        amount: 54000,
        status: 'shipped',
        items: [
          { productId: 'PROD-6', productName: 'Smart TV 43"', quantity: 1, price: 54000 }
        ],
        shippingAddress: {
          street: '321 Queen St',
          city: 'Kano',
          state: 'Kano',
          zipCode: '700001',
          country: 'Nigeria'
        },
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid'
      },
      {
        id: 'ORD-12349',
        customerName: 'David Brown',
        customerId: 'CUST-5',
        date: new Date(2025, 3, 11),
        amount: 18000,
        status: 'cancelled',
        items: [
          { productId: 'PROD-7', productName: 'Gaming Console', quantity: 1, price: 18000 }
        ],
        shippingAddress: {
          street: '654 Market St',
          city: 'Enugu',
          state: 'Enugu',
          zipCode: '400001',
          country: 'Nigeria'
        },
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'refunded'
      }
    ],
    topProducts: [
      {
        id: 'PROD-1',
        name: 'Smartphone X',
        description: 'Latest smartphone with advanced features',
        price: 15000,
        stock: 120,
        image: 'assets/images/products/smartphone.jpg',
        categoryId: 'CAT-1',
        sellerId: 'SEL-1',
        sellerName: 'TechHub',
        status: 'active',
        createdAt: new Date(2025, 1, 15),
        updatedAt: new Date(2025, 3, 10),
        unitsSold: 342,
        rating: 4.7,
        reviewCount: 156
      },
      {
        id: 'PROD-3',
        name: 'Laptop Pro',
        description: 'High-performance laptop for professionals',
        price: 35000,
        stock: 65,
        image: 'assets/images/products/laptop.jpg',
        categoryId: 'CAT-1',
        sellerId: 'SEL-1',
        sellerName: 'TechHub',
        status: 'active',
        createdAt: new Date(2025, 1, 10),
        updatedAt: new Date(2025, 3, 5),
        unitsSold: 187,
        rating: 4.8,
        reviewCount: 92
      },
      {
        id: 'PROD-6',
        name: 'Smart TV 43"',
        description: 'Full HD Smart TV with voice control',
        price: 54000,
        stock: 35,
        image: 'assets/images/products/smart-tv.jpg',
        categoryId: 'CAT-1',
        sellerId: 'SEL-3',
        sellerName: 'HomeElectronics',
        status: 'active',
        createdAt: new Date(2025, 2, 20),
        updatedAt: new Date(2025, 3, 12),
        unitsSold: 124,
        rating: 4.5,
        reviewCount: 78
      },
      {
        id: 'PROD-4',
        name: 'Wireless Earbuds',
        description: 'Premium wireless earbuds with noise cancellation',
        price: 8000,
        stock: 200,
        image: 'assets/images/products/earbuds.jpg',
        categoryId: 'CAT-1',
        sellerId: 'SEL-2',
        sellerName: 'AudioPlus',
        status: 'active',
        createdAt: new Date(2025, 2, 5),
        updatedAt: new Date(2025, 3, 8),
        unitsSold: 256,
        rating: 4.6,
        reviewCount: 112
      },
      {
        id: 'PROD-7',
        name: 'Gaming Console',
        description: 'Next-generation gaming console',
        price: 18000,
        stock: 40,
        image: 'assets/images/products/gaming-console.jpg',
        categoryId: 'CAT-1',
        sellerId: 'SEL-4',
        sellerName: 'GameZone',
        status: 'active',
        createdAt: new Date(2025, 2, 25),
        updatedAt: new Date(2025, 3, 11),
        unitsSold: 98,
        rating: 4.9,
        reviewCount: 45
      }
    ]
  };

  // Mock products data
  private mockProducts: Product[] = [
    ...this.mockDashboardStats.topProducts,
    {
      id: 'PROD-2',
      name: 'Phone Case',
      description: 'Durable protective case for smartphones',
      price: 2000,
      stock: 350,
      image: 'assets/images/products/phone-case.jpg',
      categoryId: 'CAT-2',
      sellerId: 'SEL-1',
      sellerName: 'TechHub',
      status: 'active',
      createdAt: new Date(2025, 2, 1),
      updatedAt: new Date(2025, 3, 9),
      unitsSold: 423,
      rating: 4.3,
      reviewCount: 210
    },
    {
      id: 'PROD-5',
      name: 'Screen Protector',
      description: 'Tempered glass screen protector',
      price: 1500,
      stock: 500,
      image: 'assets/images/products/screen-protector.jpg',
      categoryId: 'CAT-2',
      sellerId: 'SEL-1',
      sellerName: 'TechHub',
      status: 'active',
      createdAt: new Date(2025, 2, 15),
      updatedAt: new Date(2025, 3, 7),
      unitsSold: 356,
      rating: 4.2,
      reviewCount: 175
    },
    {
      id: 'PROD-8',
      name: 'Smart Watch',
      description: 'Fitness and health tracking smart watch',
      price: 12000,
      stock: 85,
      image: 'assets/images/products/smart-watch.jpg',
      categoryId: 'CAT-1',
      sellerId: 'SEL-1',
      sellerName: 'TechHub',
      status: 'active',
      createdAt: new Date(2025, 3, 1),
      updatedAt: new Date(2025, 3, 13),
      unitsSold: 76,
      rating: 4.6,
      reviewCount: 34
    },
    {
      id: 'PROD-9',
      name: 'Bluetooth Speaker',
      description: 'Portable wireless speaker with rich sound',
      price: 7500,
      stock: 110,
      image: 'assets/images/products/bluetooth-speaker.jpg',
      categoryId: 'CAT-1',
      sellerId: 'SEL-2',
      sellerName: 'AudioPlus',
      status: 'active',
      createdAt: new Date(2025, 2, 10),
      updatedAt: new Date(2025, 3, 5),
      unitsSold: 128,
      rating: 4.4,
      reviewCount: 67
    },
    {
      id: 'PROD-10',
      name: 'External Hard Drive',
      description: '1TB external hard drive for data storage',
      price: 9000,
      stock: 95,
      image: 'assets/images/products/hard-drive.jpg',
      categoryId: 'CAT-3',
      sellerId: 'SEL-1',
      sellerName: 'TechHub',
      status: 'active',
      createdAt: new Date(2025, 2, 18),
      updatedAt: new Date(2025, 3, 8),
      unitsSold: 89,
      rating: 4.5,
      reviewCount: 42
    }
  ];

  // Mock categories data
  private mockCategories: Category[] = [
    {
      id: 'CAT-1',
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      image: 'assets/images/categories/electronics.jpg',
      status: 'active',
      productCount: 324
    },
    {
      id: 'CAT-2',
      name: 'Accessories',
      description: 'Accessories for electronic devices',
      image: 'assets/images/categories/accessories.jpg',
      parentId: 'CAT-1',
      status: 'active',
      productCount: 156
    },
    {
      id: 'CAT-3',
      name: 'Computer Hardware',
      description: 'Computer parts and peripherals',
      image: 'assets/images/categories/hardware.jpg',
      status: 'active',
      productCount: 87
    },
    {
      id: 'CAT-4',
      name: 'Fashion',
      description: 'Clothing, shoes, and fashion items',
      image: 'assets/images/categories/fashion.jpg',
      status: 'active',
      productCount: 432
    },
    {
      id: 'CAT-5',
      name: 'Home & Kitchen',
      description: 'Home appliances and kitchen essentials',
      image: 'assets/images/categories/home.jpg',
      status: 'active',
      productCount: 245
    },
    {
      id: 'CAT-6',
      name: 'Beauty & Health',
      description: 'Beauty products and health essentials',
      image: 'assets/images/categories/beauty.jpg',
      status: 'active',
      productCount: 178
    }
  ];

  // Mock orders data
  private mockOrders: Order[] = [
    ...this.mockDashboardStats.recentOrders,
    {
      id: 'ORD-12350',
      customerName: 'Rebecca Green',
      customerId: 'CUST-6',
      date: new Date(2025, 3, 11),
      amount: 12000,
      status: 'delivered',
      items: [
        { productId: 'PROD-8', productName: 'Smart Watch', quantity: 1, price: 12000 }
      ],
      shippingAddress: {
        street: '987 Oak Ave',
        city: 'Ibadan',
        state: 'Oyo',
        zipCode: '200001',
        country: 'Nigeria'
      },
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid'
    },
    {
      id: 'ORD-12351',
      customerName: 'Thomas Clark',
      customerId: 'CUST-7',
      date: new Date(2025, 3, 10),
      amount: 7500,
      status: 'delivered',
      items: [
        { productId: 'PROD-9', productName: 'Bluetooth Speaker', quantity: 1, price: 7500 }
      ],
      shippingAddress: {
        street: '753 Pine St',
        city: 'Kaduna',
        state: 'Kaduna',
        zipCode: '800001',
        country: 'Nigeria'
      },
      paymentMethod: 'Mobile Money',
      paymentStatus: 'paid'
    }
  ];

  // Mock users data (customers)
  private mockCustomers: User[] = [
    {
      id: 'CUST-1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'customer',
      phoneNumber: '+234 801 234 5678',
      avatar: 'assets/images/users/john-doe.jpg',
      status: 'active',
      createdAt: new Date(2024, 9, 15),
      lastLogin: new Date(2025, 3, 13),
      addresses: [
        {
          id: 'ADDR-1',
          street: '123 Main St',
          city: 'Lagos',
          state: 'Lagos',
          zipCode: '100001',
          country: 'Nigeria',
          isDefault: true
        }
      ]
    },
    {
      id: 'CUST-2',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'customer',
      phoneNumber: '+234 802 345 6789',
      avatar: 'assets/images/users/jane-smith.jpg',
      status: 'active',
      createdAt: new Date(2024, 10, 5),
      lastLogin: new Date(2025, 3, 13),
      addresses: [
        {
          id: 'ADDR-2',
          street: '456 Park Ave',
          city: 'Abuja',
          state: 'FCT',
          zipCode: '900001',
          country: 'Nigeria',
          isDefault: true
        }
      ]
    },
    {
      id: 'CUST-3',
      email: 'michael.johnson@example.com',
      firstName: 'Michael',
      lastName: 'Johnson',
      role: 'customer',
      phoneNumber: '+234 803 456 7890',
      avatar: 'assets/images/users/michael-johnson.jpg',
      status: 'active',
      createdAt: new Date(2024, 11, 20),
      lastLogin: new Date(2025, 3, 12),
      addresses: [
        {
          id: 'ADDR-3',
          street: '789 River Rd',
          city: 'Port Harcourt',
          state: 'Rivers',
          zipCode: '500001',
          country: 'Nigeria',
          isDefault: true
        }
      ]
    },
    {
      id: 'CUST-4',
      email: 'sarah.williams@example.com',
      firstName: 'Sarah',
      lastName: 'Williams',
      role: 'customer',
      phoneNumber: '+234 804 567 8901',
      avatar: 'assets/images/users/sarah-williams.jpg',
      status: 'active',
      createdAt: new Date(2024, 12, 10),
      lastLogin: new Date(2025, 3, 12),
      addresses: [
        {
          id: 'ADDR-4',
          street: '321 Queen St',
          city: 'Kano',
          state: 'Kano',
          zipCode: '700001',
          country: 'Nigeria',
          isDefault: true
        }
      ]
    },
    {
      id: 'CUST-5',
      email: 'david.brown@example.com',
      firstName: 'David',
      lastName: 'Brown',
      role: 'customer',
      phoneNumber: '+234 805 678 9012',
      avatar: 'assets/images/users/david-brown.jpg',
      status: 'inactive',
      createdAt: new Date(2025, 1, 5),
      lastLogin: new Date(2025, 3, 11),
      addresses: [
        {
          id: 'ADDR-5',
          street: '654 Market St',
          city: 'Enugu',
          state: 'Enugu',
          zipCode: '400001',
          country: 'Nigeria',
          isDefault: true
        }
      ]
    }
  ];

  // Mock sellers data
  private mockSellers: Seller[] = [
    {
      id: 'SEL-1',
      email: 'techhub@example.com',
      firstName: 'Tech',
      lastName: 'Hub',
      role: 'seller',
      phoneNumber: '+234 901 234 5678',
      avatar: 'assets/images/sellers/techhub.jpg',
      status: 'active',
      createdAt: new Date(2024, 8, 1),
      lastLogin: new Date(2025, 3, 13),
      storeName: 'TechHub',
      storeDescription: 'One-stop shop for all tech needs',
      storeImage: 'assets/images/stores/techhub.jpg',
      businessAddress: {
        street: '10 Technology Drive',
        city: 'Lagos',
        state: 'Lagos',
        zipCode: '101001',
        country: 'Nigeria'
      },
      businessRegistrationNumber: 'BRN-12345',
      bankDetails: {
        accountName: 'TechHub Ltd',
        accountNumber: '0123456789',
        bankName: 'First Bank'
      },
      commission: 10,
      rating: 4.8,
      reviewCount: 320,
      verificationStatus: 'verified'
    },
    {
      id: 'SEL-2',
      email: 'audioplus@example.com',
      firstName: 'Audio',
      lastName: 'Plus',
      role: 'seller',
      phoneNumber: '+234 902 345 6789',
      avatar: 'assets/images/sellers/audioplus.jpg',
      status: 'active',
      createdAt: new Date(2024, 9, 15),
      lastLogin: new Date(2025, 3, 12),
      storeName: 'AudioPlus',
      storeDescription: 'Premium audio equipment and accessories',
      storeImage: 'assets/images/stores/audioplus.jpg',
      businessAddress: {
        street: '25 Sound Avenue',
        city: 'Lagos',
        state: 'Lagos',
        zipCode: '101002',
        country: 'Nigeria'
      },
      businessRegistrationNumber: 'BRN-23456',
      bankDetails: {
        accountName: 'AudioPlus Nigeria',
        accountNumber: '1234567890',
        bankName: 'GTBank'
      },
      commission: 12,
      rating: 4.7,
      reviewCount: 185,
      verificationStatus: 'verified'
    },
    {
      id: 'SEL-3',
      email: 'homeelectronics@example.com',
      firstName: 'Home',
      lastName: 'Electronics',
      role: 'seller',
      phoneNumber: '+234 903 456 7890',
      avatar: 'assets/images/sellers/homeelectronics.jpg',
      status: 'active',
      createdAt: new Date(2024, 10, 5),
      lastLogin: new Date(2025, 3, 11),
      storeName: 'HomeElectronics',
      storeDescription: 'Home appliances and electronic goods',
      storeImage: 'assets/images/stores/homeelectronics.jpg',
      businessAddress: {
        street: '15 Appliance Road',
        city: 'Abuja',
        state: 'FCT',
        zipCode: '900101',
        country: 'Nigeria'
      },
      businessRegistrationNumber: 'BRN-34567',
      bankDetails: {
        accountName: 'Home Electronics Ltd',
        accountNumber: '2345678901',
        bankName: 'Access Bank'
      },
      commission: 8,
      rating: 4.5,
      reviewCount: 142,
      verificationStatus: 'verified'
    },
    {
      id: 'SEL-4',
      email: 'gamezone@example.com',
      firstName: 'Game',
      lastName: 'Zone',
      role: 'seller',
      phoneNumber: '+234 904 567 8901',
      avatar: 'assets/images/sellers/gamezone.jpg',
      status: 'active',
      createdAt: new Date(2024, 11, 20),
      lastLogin: new Date(2025, 3, 10),
      storeName: 'GameZone',
      storeDescription: 'Gaming consoles, accessories and games',
      storeImage: 'assets/images/stores/gamezone.jpg',
      businessAddress: {
        street: '7 Gaming Street',
        city: 'Port Harcourt',
        state: 'Rivers',
        zipCode: '500101',
        country: 'Nigeria'
      },
      businessRegistrationNumber: 'BRN-45678',
      bankDetails: {
        accountName: 'GameZone Nigeria',
        accountNumber: '3456789012',
        bankName: 'UBA'
      },
      commission: 15,
      rating: 4.9,
      reviewCount: 87,
      verificationStatus: 'verified'
    },
    {
      id: 'SEL-5',
      email: 'fashionstyle@example.com',
      firstName: 'Fashion',
      lastName: 'Style',
      role: 'seller',
      phoneNumber: '+234 905 678 9012',
      avatar: 'assets/images/sellers/fashionstyle.jpg',
      status: 'active',
      createdAt: new Date(2025, 1, 10),
      lastLogin: new Date(2025, 3, 9),
      storeName: 'FashionStyle',
      storeDescription: 'Trendy clothing and fashion accessories',
      storeImage: 'assets/images/stores/fashionstyle.jpg',
      businessAddress: {
        street: '22 Fashion Boulevard',
        city: 'Lagos',
        state: 'Lagos',
        zipCode: '101005',
        country: 'Nigeria'
      },
      businessRegistrationNumber: 'BRN-56789',
      bankDetails: {
        accountName: 'Fashion Style Boutique',
        accountNumber: '4567890123',
        bankName: 'Zenith Bank'
      },
      commission: 18,
      rating: 4.6,
      reviewCount: 215,
      verificationStatus: 'verified'
    }
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

  constructor() { }

  // Dashboard methods
  getDashboardStats(): Observable<DashboardStats> {
    // Simulate API call with delay
    return of(this.mockDashboardStats).pipe(delay(800));
  }

  // Product methods
  getProducts(filters?: any): Observable<Product[]> {
    // TODO: Implement filtering logic
    return of(this.mockProducts).pipe(delay(800));
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product).pipe(delay(500));
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    const newProduct: Product = {
      ...product,
      id: `PROD-${this.mockProducts.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // In a real application, we would add to the array
    // this.mockProducts.push(newProduct);
    
    return of(newProduct).pipe(delay(800));
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    const updatedProduct: Product = {
      ...this.mockProducts[index],
      ...product,
      updatedAt: new Date()
    };
    
    // In a real application, we would update the array
    // this.mockProducts[index] = updatedProduct;
    
    return of(updatedProduct).pipe(delay(800));
  }

  deleteProduct(id: string): Observable<boolean> {
    const index = this.mockProducts.findIndex(p => p.id === id);
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

  getCategoryById(id: string): Observable<Category | undefined> {
    const category = this.mockCategories.find(c => c.id === id);
    return of(category).pipe(delay(500));
  }

  createCategory(category: Omit<Category, 'id'>): Observable<Category> {
    const newCategory: Category = {
      ...category,
      id: `CAT-${this.mockCategories.length + 1}`
    };
    
    // In a real application, we would add to the array
    // this.mockCategories.push(newCategory);
    
    return of(newCategory).pipe(delay(800));
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
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

  deleteCategory(id: string): Observable<boolean> {
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

  getOrderById(id: string): Observable<Order | undefined> {
    const order = this.mockOrders.find(o => o.id === id);
    return of(order).pipe(delay(500));
  }

  updateOrderStatus(id: string, status: Order['status']): Observable<Order> {
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

  getCustomerById(id: string): Observable<User | undefined> {
    const customer = this.mockCustomers.find(c => c.id === id);
    return of(customer).pipe(delay(500));
  }

  updateCustomerStatus(id: string, status: User['status']): Observable<User> {
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

  getSellerById(id: string): Observable<Seller | undefined> {
    const seller = this.mockSellers.find(s => s.id === id);
    return of(seller).pipe(delay(500));
  }

  updateSellerStatus(id: string, status: Seller['status']): Observable<Seller> {
    const index = this.mockSellers.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Seller not found');
    }
    
    const updatedSeller: Seller = {
      ...this.mockSellers[index],
      status
    };
    
    // In a real application, we would update the array
    // this.mockSellers[index] = updatedSeller;
    
    return of(updatedSeller).pipe(delay(800));
  }

  updateSellerVerification(id: string, status: Seller['verificationStatus'], rejectionReason?: string): Observable<Seller> {
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