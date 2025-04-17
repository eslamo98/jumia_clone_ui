import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginationParams } from '../../models/general';
import { Product } from '../../models/product';
import { ProductResponse } from '../../models/product';
@Injectable({
    providedIn: 'root'
  })
export class ProductService {
    

 private apiUrl = environment.apiUrl;
  
 constructor(private http: HttpClient) {}
 
 getProductById(id: number, includeDetails: boolean): Observable<Product> {
  const params = new HttpParams()
    .set('includeDetails', includeDetails.toString());

  return this.http.get<ProductResponse>(`${this.apiUrl}/api/Products/${id}`, { params })
    .pipe(
      map(response => {
        // Adjust based on your API response structure
        if (response.success && response.data.length > 0) {
          return response.data[0];
        }
        throw new Error('Product not found');
      }),
      catchError(err => {
        // Handle specific error cases
        if (err.status === 404) {
          throw new Error('Product not found');
        }
        throw err;
      })
    );
}
}
  
  

// getProductById(id: number): Observable<Product> {
//     return this.http.get<Product>(`${this.apiUrl}/api/Products/${id}`);
//   }

