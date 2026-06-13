import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MovementService {

  private api = inject(ApiService);

  createMovement(data: any) {
    return this.api.post('/movements', data);
  }

  getHistory(productId: number) {
    return this.api.get(`/movements/${productId}/history`);
  }
}
