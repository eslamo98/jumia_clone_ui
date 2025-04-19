import { PaginationParams } from "./general";
export interface ApiResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export interface Product {
  productId: number;
  name: string;
  description: string;
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  stockQuantity: number;
  isAvailable: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'deleted' | 'pending_review';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  mainImageUrl: string;
  averageRating: number;
  sellerId: number;
  sellerName: string;
  subcategoryId: number;
  subcategoryName: string;
  categoryId: number;
  categoryName: string | null;
  ratingCount: number;
  reviewCount: number;
  unitsSold?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  attributeValues: ProductAttributeValue[];
}

export interface ProductImage {
  imageId: number;
  productId: number;
  imageUrl: string;
  displayOrder: number;
}

export interface ProductVariant {
  variantId: number;
  productId: number;
  variantName: string;
  price: number;
  discountPercentage: number;
  finalPrice: number;
  stockQuantity: number;
  sku: string;
  variantImageUrl: string;
  isDefault: boolean;
  isAvailable: boolean;
  attributes: VariantAttribute[]; // Currently an empty array
}

export interface VariantAttribute {
  // If attributes ever get values, define fields here
}

export interface ProductAttributeValue {
  valueId: number;
  productId: number;
  attributeId: number;
  attributeName: string;
  attributeType: string;
  value: string;
}

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
    id: number;
    customerName: string;
    customerId: number;
    date: string; // ISO date string for consistency
    amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
    items: OrderItem[];
    shippingAddress: Address;
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  }
  
  export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    discount?: number;
  }
  
  // src/app/models/product.model.ts
  // export interface Product {
  //   id: string;
  //   name: string;
  //   description: string;
  //   price: number;
  //   discountPrice?: number;
  //   stock: number;
  //   image: string;
  //   images?: string[];
  //   categoryId: string;
  //   category?: Category;
  //   sellerId: string;
  //   sellerName?: string;
  //   rating?: number;
  //   reviewCount?: number;
  //   featured?: boolean;
  //   status: 'active' | 'inactive' | 'draft';
  //   createdAt: Date;
  //   updatedAt: Date;
  //   unitsSold?: number;
  // }
  
  // src/app/models/category.model.ts
  export interface Category {
    id: number;
    name: string;
    description?: string;
    image?: string;
    parentId?: number;
    subCategories?: Category[];
    productCount?: number;
    status: 'active' | 'inactive';
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }
  
  // src/app/models/user.model.ts
  export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'Admin' | 'Customer' | 'Seller';
    phoneNumber?: string;
    avatar?: string;
    addresses?: Address[];
    status: 'active' | 'inactive' | 'banned';
    createdAt: string; // ISO date string
    lastLogin?: string; // ISO date string
  }
  
  export interface Address {
    id?: number;
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
  export interface ProductQueryParams extends PaginationParams {
    categoryId?: number;
    subcategoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sellerId?: number;
    searchTerm?: string;
    approvalStatus?: 'pending' | 'approved' | 'rejected' | 'deleted' | 'pending_review';
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
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