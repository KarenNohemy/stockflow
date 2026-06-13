import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { StockAlert } from '../../shared/models/stock-alert.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryStore {

  // =====================
  // STATE
  // =====================
  products = signal<Product[]>([]);
  alerts = signal<StockAlert[]>([]);
  selectedProduct = signal<Product | null>(null);

  loading = signal(false);
  error = signal<string | null>(null);

  // =====================
  // COMPUTED
  // =====================
  totalProducts = computed(() => this.products().length);

  criticalAlerts = computed(() =>
    this.alerts().filter(a => a.severity === 'CRITICAL').length
  );

  totalInventoryValue = computed(() =>
    this.products().reduce(
      (acc, p) => acc + (p.currentStock * Number(p.unitPrice)),
      0
    )
  );

  // =====================
  // EFFECTS
  // =====================
  constructor() {

    // Persistir productos seleccionados o filtros (base)
    effect(() => {
      const selected = this.selectedProduct();
      if (selected) {
        localStorage.setItem('selectedProduct', JSON.stringify(selected));
      }
    });

    // Ejemplo: persistir alerts snapshot
    effect(() => {
      localStorage.setItem('alerts', JSON.stringify(this.alerts()));
    });
  }

  // =====================
  // ACTIONS
  // =====================

  setProducts(products: Product[]) {
    this.products.set(products);
  }

  setAlerts(alerts: StockAlert[]) {
    this.alerts.set(alerts);
  }

  selectProduct(product: Product) {
    this.selectedProduct.set(product);
  }

  setLoading(value: boolean) {
    this.loading.set(value);
  }

  setError(message: string | null) {
    this.error.set(message);
  }
}
