import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StockAlert } from '../../shared/models/stock-alert.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {

  private http = inject(HttpClient);

  private baseUrl = 'http://localhost:8080/api/v1/alerts';

  getAlerts(): Observable<StockAlert[]> {
    return this.http.get<StockAlert[]>(this.baseUrl);
  }
}
