import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../shared/models/product.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/enviroments';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private http = inject(HttpClient);


private baseUrl = `${environment.apiUrl}/products`;


  getProducts(category?: string, page = 0, size = 10): Observable<any> {
    let url = `${this.baseUrl}?page=${page}&size=${size}`;

    if (category) {
      url += `&category=${category}`;
    }

    return this.http.get<any>(url);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }
}
