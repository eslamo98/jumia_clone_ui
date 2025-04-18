// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ProductResponse {
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
  mainImageUrl: string;
  averageRating: number;
  sellerId: number;
  sellerName: string;
  subcategoryName: string;
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'your-api-endpoint'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getFlashSaleProducts(): Observable<Product[]> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products/flash-sales`)
      .pipe(
        map(response => response.data)
      );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }
  
  // Add more methods as needed
}