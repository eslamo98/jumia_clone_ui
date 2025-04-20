export interface Product {
    ProductId: number;
    SellerId: number;
    SubcategoryId: number;
    Name: string;
    Description: string;
    BasePrice: number;
    DiscountPercentage: number;
    IsAvailable: boolean;
    StockQuantity: number;
    MainImageUrl: string;
    AverageRating: number;
    SellerName: string;
    CategoryId: number;
    CategoryName: string;
    RatingCount: number;
    ReviewCount: number;
    Images: ProductImage[];
    Variants: ProductVariant[];
    AttributeValues: ProductAttribute[];
}

export interface ProductImage {
    ImageId: number;
    ProductId: number;
    ImageUrl: string;
    DisplayOrder: number;
}

export interface ProductVariant {
    VariantId: number;
    ProductId: number;
    VariantName: string;
    Price: number;
    DiscountPercentage: number;
    FinalPrice: number;
    StockQuantity: number;
    Sku: string;
    VariantImageUrl: string;
    IsDefault: boolean;
    IsAvailable: boolean;
    Attributes: any[];
}

export interface ProductAttribute {
    ValueId: number;
    ProductId: number;
    AttributeId: number;
    AttributeName: string;
    AttributeType: string;
    Value: string;
}
  
export interface ProductResponse {
    success: boolean;
    message: string;
    data: Product;
}
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
    

    AverageRating: number;
  }
  
 export interface ProductResponse {
    success: boolean;
    message: string;
    data: Product;
  }
