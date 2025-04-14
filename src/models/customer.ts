export interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    profileImageUrl?: string;
}
  
export interface UpdateUserProfile {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
}
  
export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
}

export interface Address {
    addressId: number;
    userId: number;
    streetAddress: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    isDefault?: boolean;
    addressName?: string;
}

export interface CreateAddressInput {
    userId: number;
    streetAddress: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    isDefault?: boolean;
    addressName?: string;
}

export interface UpdateAddressInput {
    addressId: number;
    userId: number;
    streetAddress: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    isDefault?: boolean;
    addressName?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface Order {
    orderId: number;
    createdAt: string;
    finalAmount: number;
    status: string;
    totalAmount: number;
    orderDate: Date;
}
  
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
}

export interface WishlistItem {
    wishlistId: number;
    productId: number;
    userId: number;
    addedDate: Date;
    product: {
        id: number;
        name: string;
        description: string;
        price: number;
        imageUrl: string;
    };
}