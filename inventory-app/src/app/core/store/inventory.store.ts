import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { StockAlert } from '../../shared/models/stock-alert.model';
import { ProductService } from '../services/product.service';
import { AlertService } from '../services/alert.service';

@Injectable({ providedIn: 'root' })
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

  // ✅ TOAST FINAL (CORRECTO)
  toastMessage = signal<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  filterCategory = signal(localStorage.getItem('filterCategory') ?? '');

  inventorySummary = signal<{
    totalInventoryValue: number;
    totalProducts: number;
  } | null>(null);

  // COMPUTED
  totalProductsComputed = computed(() => this.totalProducts());

  criticalAlerts = computed(() =>
    this.alerts().filter(a => a.severity === 'CRITICAL').length
  );

  totalInventoryValue = computed(() =>
    this.products().reduce(
      (acc, p) => acc + (p.currentStock * Number(p.unitPrice)),
      0
    )
  );

  private toastTimeout: any;

  constructor() {

    effect(() => {
      localStorage.setItem('filterCategory', this.filterCategory());
    });

    effect(() => {
      const toast = this.toastMessage();
      if (!toast) return;

      clearTimeout(this.toastTimeout);

      this.toastTimeout = setTimeout(() => {
        this.toastMessage.set(null);
      }, 3000);
    });
  }

  refreshAll() {
    this.loadProducts();
    this.loadAlerts();
    this.loadInventorySummary();
  }

  setFilterCategory(category: string) {
  this.filterCategory.set(category);
  }

    loadProducts(category?: string, page = 0) {
    this.loading.set(true);

    const size = 10;

    this.productService.getProducts(category, page, size).subscribe({
      next: (resp) => {
        this.products.set(resp.content);

        // 🔥 IMPORTANTE: esto faltaba en tu versión final
        this.totalPages.set(resp.totalPages);
        this.totalProducts.set(resp.totalElements);
        this.currentPage.set(resp.number);

        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);

        this.toastMessage.set({
          type: 'error',
          text: err?.message ?? 'Error loading products'
        });
      }
    });
  }

loadAlerts() {
  this.alertService.getAlerts().subscribe({
    next: (data) => {

      const old = JSON.stringify(this.alerts());
      const next = JSON.stringify(data);

      this.alerts.set(data);

      if (old !== next) {
        this.toastMessage.set({
          type: 'info',
          text: `⚠ Alerts updated (${data.length})`
        });
      }
    }
  });
}

  loadInventorySummary() {
    this.productService.getInventorySummary().subscribe({
      next: (data) => this.inventorySummary.set(data),
      error: (err) =>
        this.toastMessage.set({
          type: 'error',
          text: err?.message ?? 'Error summary'
        })
    });
  }
}
