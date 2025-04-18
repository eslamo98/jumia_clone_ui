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
}
