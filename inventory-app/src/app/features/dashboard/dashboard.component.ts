import { Component, effect, inject, signal } from '@angular/core';
import { InventoryStore } from '../../core/store/inventory.store';
import { CommonModule } from '@angular/common';
import { MovementHistoryComponent } from '../movements/movements-history/movements-history.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MovementHistoryComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  store = inject(InventoryStore);
  timeout: any;
  selectedProductId: number | null = null;


  constructor() {
    this.store.loadProducts(
      this.store.filterCategory()
    );

    this.store.loadAlerts();
  }

  getStockLabel(product: any): string {
    if (product.currentStock <= product.minStock * 0.5) {
      return 'CRITICAL';
    }

    if (product.currentStock <= product.minStock) {
      return 'LOW';
    }

    return 'OK';
  }

  getStockClass(product: any): string {
    const status = this.getStockLabel(product);

    switch (status) {
      case 'CRITICAL':
        return 'bg-danger';
      case 'LOW':
        return 'bg-warning';
      default:
        return 'bg-success';
    }
  }

  onFilterChange(value: string) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
     this.store.setFilterCategory(value);
     this.store.loadProducts(value);
    }, 300);
  }


  showHistory(productId: number) {
    this.selectedProductId = productId;
  }

  onMovementCreated(productId: number) {
    this.selectedProductId = productId;
  }


}
