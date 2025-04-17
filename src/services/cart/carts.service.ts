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
  addItemToCart(): Observable<any> {
     
      const request = {
        "productId": 1011,
        "quantity": 5,
      };
      return this.http.post<any>(`${this.apiUrl}/api/Carts/items`, request)
        .pipe(
          tap(response => {
            if (response.success) {
                console.log('successfully:', response.data);
            }
          }),
          catchError(error => {
            // If refresh token fails, log the user out
            console.error(error)
            return "";
          })
        );
    }
  
}
