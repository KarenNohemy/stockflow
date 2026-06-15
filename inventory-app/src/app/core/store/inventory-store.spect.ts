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
  // STATE
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
  // COMPUTED
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
    const s = this.inventorySummary();
    if (!s || !s.totalProducts) return 0;
    return s.totalInventoryValue / s.totalProducts;
  });

  // =========================
  // CONSTRUCTOR (ONLY EFFECTS)
  // =========================
  constructor() {

    // persist filter
    effect(() => {
      localStorage.setItem('filterCategory', this.filterCategory());
    });

    // auto-clear toast (TEST FRIENDLY)
    effect(() => {
      const toast = this.toastMessage();

      if (!toast) return;

      this.scheduleToastClear();
    });
  }

  // =========================
  // INTERNAL HELPERS
  // =========================

  private setLoading(value: boolean) {
    this.loading.set(value);
  }

  private scheduleToastClear(ms = 3000) {
    clearTimeout(this.toastTimeout);

    this.toastTimeout = setTimeout(() => {
      this.toastMessage.set(null);
    }, ms);
  }

  private hasAlertsChanged(newAlerts: StockAlert[]): boolean {
    const current = this.alerts();
    return current.length !== newAlerts.length;
  }

  // =========================
  // PUBLIC API
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

  loadProducts(category?: string, page = 0) {
    this.setLoading(true);

    const size = 10;

    this.productService.getProducts(category, page, size).subscribe({
      next: (resp) => {
        this.products.set(resp.content);
        this.totalPages.set(resp.totalPages);
        this.totalProducts.set(resp.totalElements);
        this.currentPage.set(resp.number);
        this.setLoading(false);
      },
      error: (err) => {
        this.setLoading(false);
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

        const changed = this.hasAlertsChanged(data);

        this.alerts.set(data);

        if (changed) {
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
