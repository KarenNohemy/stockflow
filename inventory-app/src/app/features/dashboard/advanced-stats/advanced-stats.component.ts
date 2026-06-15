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
  const s = this.store.inventorySummary();
  if (!s || !s.totalProducts) return 0;

  return s.totalInventoryValue / s.totalProducts;
  });

  lowStockCount = computed(() => {
    return this.store.inventorySummary()?.lowStockProducts ?? 0;
  });

  totalUnits = computed(() => {
    return this.store.inventorySummary()?.totalUnits ?? 0;
  });
}
