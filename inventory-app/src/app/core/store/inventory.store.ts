import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { StockAlert } from '../../shared/models/stock-alert.model';

import { ProductService } from '../services/product.service';
import { AlertService } from '../services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryStore {

  private productService = inject(ProductService);
  private alertService = inject(AlertService);

  // STATE
  products = signal<Product[]>([]);
  alerts = signal<StockAlert[]>([]);
  selectedProduct = signal<Product | null>(null);

  loading = signal(false);
  error = signal<string | null>(null);

  // COMPUTED
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

  // EFFECTS
  constructor() {
    effect(() => {
      const selected = this.selectedProduct();
      if (selected) {
        localStorage.setItem('selectedProduct', JSON.stringify(selected));
      }
    });

    effect(() => {
      localStorage.setItem('alerts', JSON.stringify(this.alerts()));
    });
  }

  // ACTIONS
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

  // LOAD PRODUCTS
  loadProducts(category?: string) {
    this.loading.set(true);

    this.productService.getProducts(category).subscribe({
      next: (resp) => {
        this.products.set(resp.content ?? resp);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  // LOAD ALERTS
  loadAlerts() {
    this.alertService.getAlerts().subscribe({
      next: (data) => {
        this.alerts.set(data);
      },
      error: (err) => {
        this.error.set(err.message);
      }
    });
  }
}
