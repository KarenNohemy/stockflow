import { Component, inject, signal } from '@angular/core';
import { InventoryStore } from '../../core/store/inventory.store';
import { CommonModule } from '@angular/common';
import { MovementHistoryComponent } from '../movements/movements-history/movements-history.component';
import { AdvancedStatsComponent } from './advanced-stats/advanced-stats.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MovementHistoryComponent, AdvancedStatsComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  store = inject(InventoryStore);

  // ✅ SIGNAL correcto
  selectedProductId = signal<number | null>(null);

  private timeout: any;

  constructor() {
    this.store.refreshAll();
  }

  showHistory(productId: number) {
    this.selectedProductId.set(productId);
  }

  onMovementCreated(productId: number) {
    this.selectedProductId.set(productId);
  }

  onFilterChange(value: string) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      const cleanValue = value?.trim();

      this.store.setFilterCategory(cleanValue);
      this.store.loadProducts(cleanValue || undefined);
    }, 300);
  }

  getStockLabel(product: any): string {
    if (product.currentStock <= product.minStock * 0.5) return 'CRITICAL';
    if (product.currentStock <= product.minStock) return 'LOW';
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

  changePage(page: number) {
  this.store.loadProducts(this.store.filterCategory(), page);
  }
}
