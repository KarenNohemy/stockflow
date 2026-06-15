import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { InventoryStore } from '../../core/store/inventory.store';

describe('DashboardComponent', () => {

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

const storeMock = {
  refreshAll: jasmine.createSpy('refreshAll'),
  loadProducts: jasmine.createSpy('loadProducts'),
  setFilterCategory: jasmine.createSpy('setFilterCategory'),

  filterCategory: jasmine.createSpy('filterCategory').and.returnValue(''),

  loading: jasmine.createSpy('loading').and.returnValue(false),

  inventorySummary: jasmine.createSpy('inventorySummary').and.returnValue({
    totalProducts: 10,
    totalInventoryValue: 1000
  }),

  criticalAlerts: jasmine.createSpy('criticalAlerts').and.returnValue(1),

  products: jasmine.createSpy('products').and.returnValue([]),

  currentPage: jasmine.createSpy('currentPage').and.returnValue(0),

  totalPages: jasmine.createSpy('totalPages').and.returnValue(1)
};

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: InventoryStore, useValue: storeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  // =========================
  // INIT
  // =========================
  it('should create and call refreshAll on init', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(storeMock.refreshAll).toHaveBeenCalled();
  });

  // =========================
  // SIGNAL UPDATE
  // =========================
  it('should update selectedProductId', () => {
    component.showHistory(10);
    expect(component.selectedProductId()).toBe(10);
  });

  it('should update selectedProductId on movement created', () => {
    component.onMovementCreated(5);
    expect(component.selectedProductId()).toBe(5);
  });

  // =========================
  // FILTER (DEBOUNCE LOGIC)
  // =========================
  it('should call setFilterCategory and loadProducts after debounce', fakeAsync(() => {

    component.onFilterChange('  electronics  ');

    tick(300);

    expect(storeMock.setFilterCategory).toHaveBeenCalledWith('electronics');
    expect(storeMock.loadProducts).toHaveBeenCalledWith('electronics');
  }));

  it('should pass undefined when filter is empty', fakeAsync(() => {

    component.onFilterChange('   ');

    tick(300);

    expect(storeMock.setFilterCategory).toHaveBeenCalledWith('');
    expect(storeMock.loadProducts).toHaveBeenCalledWith(undefined);
  }));

  // =========================
  // PAGINATION
  // =========================
  it('should call loadProducts on page change', () => {

    storeMock.filterCategory.and.returnValue('test');

    component.changePage(2);

    expect(storeMock.loadProducts).toHaveBeenCalledWith('test', 2);
  });

  // =========================
  // STOCK LOGIC
  // =========================
  it('should return correct stock label', () => {

    expect(component.getStockLabel({ currentStock: 1, minStock: 10 }))
      .toBe('CRITICAL');

expect(component.getStockLabel({ currentStock: 8, minStock: 10 }))
  .toBe('LOW');

    expect(component.getStockLabel({ currentStock: 20, minStock: 10 }))
      .toBe('OK');
  });

  it('should return correct stock class', () => {

    expect(component.getStockClass({ currentStock: 1, minStock: 10 }))
      .toBe('bg-danger');

  expect(component.getStockClass({ currentStock: 6, minStock: 10 }))
    .toBe('bg-warning');

    expect(component.getStockClass({ currentStock: 20, minStock: 10 }))
      .toBe('bg-success');
  });

});
