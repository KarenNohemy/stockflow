import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Product } from '../../shared/models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private api = inject(ApiService);

  getProducts(category?: string, page = 0, size = 10): Observable<any> {

    let query = `?page=${page}&size=${size}`;

    if (category) {
      query += `&category=${category}`;
    }

    return this.api.get<any>(`/products${query}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.api.get<Product>(`/products/${id}`);
  }
}
