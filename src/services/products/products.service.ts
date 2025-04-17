import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginationParams } from '../../models/general';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  getProductById(id: number, includeDetails: boolean): Observable<any> {
   
    let params = new HttpParams()
      .set('includeDetails', includeDetails.toString());
    return this.http.get<any>(`${this.apiUrl}/api/Products/${id}`, { params });
  }
}
