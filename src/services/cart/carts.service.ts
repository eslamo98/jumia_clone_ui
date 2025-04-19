import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartsService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }
  
  addItemToCart(productId: number, quantity: number): Observable<any> {
    const request = {
      productId,
      quantity
    };
    
    return this.http.post<any>(`${this.apiUrl}/api/Carts/items`, request)
      .pipe(
        tap(response => {
          if (response.success) {
            console.log('Item added successfully:', response.data);
          }
        }),
        catchError(error => {
          console.error('Error adding item to cart:', error);
          throw error; // Re-throw the error so subscribers can handle it
        })
      );
  }
}
