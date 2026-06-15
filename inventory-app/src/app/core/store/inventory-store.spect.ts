import { TestBed } from '@angular/core/testing';
import { InventoryStore } from './inventory.store';
import { ProductService } from '../services/product.service';
import { AlertService } from '../services/alert.service';
import { of, throwError } from 'rxjs';

describe('InventoryStore (optimized)', () => {

  let store: InventoryStore;

  let productServiceMock: jasmine.SpyObj<ProductService>;
  let alertServiceMock: jasmine.SpyObj<AlertService>;

  beforeEach(() => {

    productServiceMock = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'getInventorySummary'
    ]);

    alertServiceMock = jasmine.createSpyObj('AlertService', [
      'getAlerts'
    ]);

    TestBed.configureTestingModule({
      providers: [
        InventoryStore,
        { provide: ProductService, useValue: productServiceMock },
        { provide: AlertService, useValue: alertServiceMock }
      ]
    });

    store = TestBed.inject(InventoryStore);
  });

  // =========================
  // PRODUCTS
  // =========================

  it('should load products successfully', () => {

    productServiceMock.getProducts.and.returnValue(of({
      content: [
        { id: 1, name: 'A', currentStock: 10, minStock: 5 }
      ],
      totalPages: 2,
      totalElements: 1,
      number: 0
    }));

    store.loadProducts();

    expect(store.products().length).toBe(1);
    expect(store.totalPages()).toBe(2);
    expect(store.totalProducts()).toBe(1);
    expect(store.currentPage()).toBe(0);
    expect(store.loading()).toBeFalse();
  });

  it('should handle product error', () => {

    productServiceMock.getProducts.and.returnValue(
      throwError(() => new Error('fail products'))
    );

    store.loadProducts();

    expect(store.loading()).toBeFalse();
    expect(store.toastMessage()?.type).toBe('error');
    expect(store.toastMessage()?.text).toContain('Error loading products');
  });

  // =========================
  // SUMMARY
  // =========================

  it('should load inventory summary', () => {

    productServiceMock.getInventorySummary.and.returnValue(of({
      totalInventoryValue: 1000,
      totalProducts: 2,
      totalUnits: 50,
      lowStockProducts: 1
    }));

    store.loadInventorySummary();

    expect(store.inventorySummary()?.totalInventoryValue).toBe(1000);
    expect(store.totalInventoryValueComputed()).toBe(1000);
    expect(store.totalProductsComputed()).toBe(2);
    expect(store.averageProductValue()).toBe(500);
  });

  it('should handle summary error', () => {

    productServiceMock.getInventorySummary.and.returnValue(
      throwError(() => new Error('summary error'))
    );

    store.loadInventorySummary();

    expect(store.toastMessage()?.type).toBe('error');
  });

  // =========================
  // ALERTS
  // =========================

  it('should load alerts and compute critical alerts', () => {

    alertServiceMock.getAlerts.and.returnValue(of([
      { productId: 1, severity: 'CRITICAL' },
      { productId: 2, severity: 'LOW' }
    ] as any));

    store.loadAlerts();

    expect(store.alerts().length).toBe(2);
    expect(store.criticalAlerts()).toBe(1);
    expect(store.lowStockCount()).toBe(0);
  });

  it('should trigger info toast when alerts change', () => {

    alertServiceMock.getAlerts.and.returnValue(of([
      { productId: 1, severity: 'LOW' }
    ] as any));

    store.loadAlerts();

    const toast = store.toastMessage();

    expect(toast?.type).toBe('info');
    expect(toast?.text).toContain('Alerts updated');
  });

  it('should handle alerts error', () => {

    alertServiceMock.getAlerts.and.returnValue(
      throwError(() => new Error('alert error'))
    );

    store.loadAlerts();

    expect(store.toastMessage()?.type).toBe('error');
    expect(store.toastMessage()?.text).toContain('Error loading alerts');
  });

  // =========================
  // UI STATE
  // =========================

  it('should update filter category', () => {

    store.setFilterCategory('electronics');

    expect(store.filterCategory()).toBe('electronics');
  });

  // =========================
  // COMPUTED VALUES EDGE CASES
  // =========================

  it('should return 0 for empty inventory summary', () => {

    expect(store.totalInventoryValueComputed()).toBe(0);
    expect(store.totalProductsComputed()).toBe(0);
    expect(store.averageProductValue()).toBe(0);
  });

});
