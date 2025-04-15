export interface Product {
    ProductId: number;
    SellerId: number;
    SubcategoryId: number;
    Name: string;
    Description: string;
    BasePrice: number;
    DiscountPercentage: number;
    IsAvailable: boolean;
    // ApprovalStatus: string;
    // CreatedAt: Date;
    // UpdatedAt: Date;
     StockQuantity: number;
    MainImageUrl: string;
    AdditionalImages?: string[]; // Add this line for multiple images

    AverageRating: number;
  }
  
 export interface ProductResponse {
    success: boolean;
    message: string;
    data: Product[];
  }