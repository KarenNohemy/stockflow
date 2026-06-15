import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { StockAlert } from '../../shared/models/stock-alert.model';
import { ProductService } from '../services/product.service';
import { AlertService } from '../services/alert.service';

@Injectable({ providedIn: 'root' })
export class InventoryStore {

  private productService = inject(ProductService);
  private alertService = inject(AlertService);

  // =========================
  // STATE (BACKEND DATA)
  // =========================
  products = signal<Product[]>([]);
  totalProducts = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);

  alerts = signal<StockAlert[]>([]);
  selectedProduct = signal<Product | null>(null);

  inventorySummary = signal<{
    totalInventoryValue: number;
    totalProducts: number;
    totalUnits: number;
    lowStockProducts: number;
  } | null>(null);

  loading = signal(false);
  error = signal<string | null>(null);

  // =========================
  // UI STATE
  // =========================
  filterCategory = signal(localStorage.getItem('filterCategory') ?? '');

  toastMessage = signal<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  private toastTimeout: any;

  // =========================
  // COMPUTED (DERIVED STATE)
  // =========================

  criticalAlerts = computed(() =>
    this.alerts().filter(a => a.severity === 'CRITICAL').length
  );

  lowStockCount = computed(() =>
    this.products().filter(p => p.currentStock <= p.minStock).length
  );

  totalUnits = computed(() =>
    this.products().reduce((acc, p) => acc + p.currentStock, 0)
  );

  totalInventoryValueComputed = computed(() =>
    this.inventorySummary()?.totalInventoryValue ?? 0
  );

  totalProductsComputed = computed(() =>
    this.inventorySummary()?.totalProducts ?? this.totalProducts()
  );

  averageProductValue = computed(() => {
    const summary = this.inventorySummary();
    if (!summary || !summary.totalProducts) return 0;

    return summary.totalInventoryValue / summary.totalProducts;
  });

  // =========================
  // EFFECTS
  // =========================
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

  // =========================
  // ACTIONS
  // =========================

  refreshAll() {
    this.loadProducts();
    this.loadAlerts();
    this.loadInventorySummary();
  }

  setFilterCategory(category: string) {
    this.filterCategory.set(category);
  }

  // =========================
  // API CALLS
  // =========================

  loadProducts(category?: string, page: number = 0) {
    this.loading.set(true);

    const size = 10;

    this.productService.getProducts(category, page, size).subscribe({
      next: (resp) => {

        this.products.set(resp.content);

        this.totalPages.set(Math.ceil(resp.totalElements / size));

        this.totalProducts.set(resp.totalElements);
        this.currentPage.set(page);

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
        this.alerts.set(data);

        if (old !== JSON.stringify(data)) {
          this.toastMessage.set({
            type: 'info',
            text: `⚠ Alerts updated (${data.length})`
          });
        }
      },
      error: (err) => {
        this.toastMessage.set({
          type: 'error',
          text: err?.message ?? 'Error loading alerts'
        });
      }
    });
  }

  loadInventorySummary() {
    this.productService.getInventorySummary().subscribe({
      next: (data) => this.inventorySummary.set(data),
      error: (err) =>
        this.toastMessage.set({
          type: 'error',
          text: err?.message ?? 'Error loading summary'
        })
    });
  }
}
