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
  totalProducts = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  alerts = signal<StockAlert[]>([]);
  selectedProduct = signal<Product | null>(null);

  loading = signal(false);
  error = signal<string | null>(null);
  toastMessage = signal<string | null>(null);

  filterCategory = signal(
    localStorage.getItem('filterCategory') ?? ''
  );

  inventorySummary = signal<{
  totalInventoryValue: number;
  totalProducts: number;
  } | null>(null);

  // COMPUTED
  totalProductsComputed = computed(() => this.totalProducts() );

  criticalAlerts = computed(() =>
    this.alerts().filter(a => a.severity === 'CRITICAL').length
  );

  totalInventoryValue = computed(() =>
    this.products().reduce(
      (acc, p) => acc + (p.currentStock * Number(p.unitPrice)),
      0
    )
  );

  refreshAll() {
    this.loadProducts();
    this.loadAlerts();
    this.loadInventorySummary();

  }
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

    effect(() => {
      localStorage.setItem(
        'filterCategory',
        this.filterCategory()
      );
    });

    let firstLoad = true;

    effect(() => {
      const alerts = this.alerts();

      if (firstLoad) {
        firstLoad = false;
        return;
      }

      if (!alerts) return;

      this.toastMessage.set(`⚠ ${alerts.length} active alerts`);

      setTimeout(() => {
        this.toastMessage.set(null);
      }, 3000);
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

  setFilterCategory(category: string) {
  this.filterCategory.set(category);
  }

  // LOAD PRODUCTS
  loadProducts(category?: string, page = 0) {
    this.loading.set(true);
  const finalCategory = category?.trim() || this.filterCategory() || undefined;
    this.productService.getProducts(finalCategory).subscribe({
      next: (resp) => {
        this.products.set(resp.content);
        this.totalProducts.set(resp.totalElements);
        this.totalPages.set(resp.totalPages);
        this.currentPage.set(resp.number);
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
          const previous = this.alerts().length;

          this.alerts.set(data);

          if (previous !== data.length) {
            this.toastMessage.set(`⚠ Alerts updated: ${data.length}`);

            setTimeout(() => {
              this.toastMessage.set(null);
            }, 4000);
          }
        }
      });
    }

  //LOAD SUMARY
  loadInventorySummary() {
    this.productService.getInventorySummary().subscribe({
      next: (data) => {
        this.inventorySummary.set(data);
      },
      error: (err) => {
        this.error.set(err.message);
      }
    });
  }
}
