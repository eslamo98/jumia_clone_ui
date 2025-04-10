// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginationParams } from '../../models/general';
import { CategoryResponse } from '../../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  getCategories(pagination: PaginationParams): Observable<CategoryResponse> {
    let params = new HttpParams()
      .set('PageSize', pagination.pageSize.toString())
      .set('PageNumber', pagination.pageNumber.toString())
      .set('include_inactive', (pagination.includeInactive || false).toString());
      
    return this.http.get<CategoryResponse>(`${this.apiUrl}/api/Categories`, { params });
  }
}