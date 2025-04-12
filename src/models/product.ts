// models/Product.ts
export interface Seller {
  seller_id: number;
  business_name: string;
}

export interface Subcategory {
  subcategory_id: number;
  name: string;
}

export interface Product {
  product_id: number;
  name: string;
  base_price: number;
  discount_percentage: number;
  final_price: number;
  average_rating: number;
  main_image_url: string;
  seller: Seller;
  subcategory: Subcategory;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    items: Product[];
    pagination: {
      total_items: number;
      total_pages: number;
      current_page: number;
      page_size: number;
      has_next_page: boolean;
      has_previous_page: boolean;
    }
  }
}
