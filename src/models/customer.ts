export interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
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
  

  export interface Order {
    orderId: number;
    createdAt: string;
    finalAmount: number;
    status: string;
    totalAmount:number;
    orderDate:Date;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
  }