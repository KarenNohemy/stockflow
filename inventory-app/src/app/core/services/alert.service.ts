import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StockAlert } from '../../shared/models/stock-alert.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/enviroment';

@Injectable({ providedIn: 'root' })
export class AlertService {

  private http = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/alerts`;

  getAlerts(): Observable<StockAlert[]> {
    return this.http.get<StockAlert[]>(this.baseUrl);
  }
}
