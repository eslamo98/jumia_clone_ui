import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginationParams } from '../../models/general';
import { catchError, map, Observable } from 'rxjs';
import { ProductResponse } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  getProductById(id: number, includeDetails: boolean): Observable<any> {
    const params = new HttpParams()
      .set('includeDetails', includeDetails.toString());
  
    return this.http.get<ProductResponse>(`${this.apiUrl}/api/Products/${id}`, { params })
      .pipe(
        map(response => {
          // Adjust based on your API response structure
          return response;
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

  getFlashSaleProducts(subCategory:string , count:number=15): Observable<any> {
    const params = new HttpParams()
    .set('subCategoryName', subCategory.toString())
    .set('count', count.toString());  
    return this.http.get<any>(`${this.apiUrl}/api/Products/random/Subcategory`,{params})
      .pipe(
        map(response => {
          console.log (response);
          // Check if response has a data property
          if (response && response.data) {
            return response.data;
          } else {
            // If response is already an array or another format
            return response;
          }
        }),
        catchError(err => {
          console.error('Error fetching flash sale products:', err);
          throw err;
        })
      );
  }
  getRandomCategoryProducts(Category:string , count:number=15): Observable<any> {
    const params = new HttpParams()
    .set('CategoryName', Category.toString())
    .set('count', count.toString());  
    return this.http.get<any>(`${this.apiUrl}/api/Products/random/Category`,{params})
      .pipe(
        map(response => {
          console.log (response);
          // Check if response has a data property
          if (response && response.data) {
            return response.data;
          } else {
            // If response is already an array or another format
            return response;
          }
        }),
        catchError(err => {
          console.error('Error fetching flash sale products:', err);
          throw err;
        })
      );
  }
}