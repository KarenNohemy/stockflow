import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryStore } from '../../../core/store/inventory.store';

@Component({
  selector: 'app-advanced-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advanced-stats.component.html'
})
export class AdvancedStatsComponent {

  store = inject(InventoryStore);

  avgProductValue = computed(() => {
    const products = this.store.products();

    if (!products.length) return 0;

    const total = products.reduce(
      (acc, p) => acc + (p.currentStock * Number(p.unitPrice)),
      0
    );

    return total / products.length;
  });

  lowStockCount = computed(() => {
    return this.store.products()
      .filter(p => p.currentStock <= p.minStock)
      .length;
  });

  totalUnits = computed(() => {
    return this.store.products()
      .reduce((acc, p) => acc + p.currentStock, 0);
  });
}
