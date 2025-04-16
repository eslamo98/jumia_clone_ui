// src/app/models/dashboard-stats.model.ts
export interface DashboardStats {
    revenue: number;
    revenueChange: number;
    orders: number;
    ordersChange: number;
    customers: number;
    customersChange: number;
    products: number;
    productsChange: number;
    recentOrders: Order[];
    topProducts: Product[];
  }
  
  // src/app/models/order.model.ts
  export interface Order {
    id: string;
    customerName: string;
    customerId: string;
    date: Date;
    amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
    items: OrderItem[];
    shippingAddress: Address;
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  }
  
  export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    discount?: number;
  }
  
  // src/app/models/product.model.ts
  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    image: string;
    images?: string[];
    categoryId: string;
    category?: Category;
    sellerId: string;
    sellerName?: string;
    rating?: number;
    reviewCount?: number;
    featured?: boolean;
    status: 'active' | 'inactive' | 'draft';
    createdAt: Date;
    updatedAt: Date;
    unitsSold?: number;
  }
  
  // src/app/models/category.model.ts
  export interface Category {
    id: string;
    name: string;
    description?: string;
    image?: string;
    parentId?: string;
    subCategories?: Category[];
    productCount?: number;
    status: 'active' | 'inactive';
  }
  
  // src/app/models/user.model.ts
  export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'customer' | 'seller';
    phoneNumber?: string;
    avatar?: string;
    addresses?: Address[];
    status: 'active' | 'inactive' | 'banned';
    createdAt: Date;
    lastLogin?: Date;
  }
  
  export interface Address {
    id?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
  }
  
  // src/app/models/seller.model.ts
  export interface Seller extends User {
    storeName: string;
    storeDescription?: string;
    storeImage?: string;
    businessAddress: Address;
    businessRegistrationNumber?: string;
    bankDetails?: BankDetails;
    commission: number;
    rating?: number;
    reviewCount?: number;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    rejectionReason?: string;
  }
  
  export interface BankDetails {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchCode?: string;
  }
  
  // src/app/models/review.model.ts
  export interface Review {
    id: string;
    productId: string;
    productName?: string;
    customerId: string;
    customerName: string;
    rating: number;
    comment: string;
    images?: string[];
    createdAt: Date;
    status: 'pending' | 'approved' | 'rejected';
    response?: {
      sellerId: string;
      sellerName: string;
      comment: string;
      createdAt: Date;
    };
  }