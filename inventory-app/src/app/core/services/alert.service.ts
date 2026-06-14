import { Injectable, inject } from '@angular/core';
import { StockAlert } from '../../shared/models/stock-alert.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/enviroment';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AlertService {

  private api = inject(ApiService);

  private baseUrl = `${environment.apiUrl}/alerts`;

  getAlerts(): Observable<StockAlert[]> {
    return this.api.get<StockAlert[]>(this.baseUrl);
  }
}
