import { TestBed } from '@angular/core/testing';
import { InventoryStore } from './inventory.store';

describe('InventoryStore', () => {

  let store: InventoryStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InventoryStore]
    });

    store = TestBed.inject(InventoryStore);
  });

  it('debe crear el store correctamente', () => {
    expect(store).toBeTruthy();
  });

  it('debe iniciar con productos vacíos', () => {
    expect(store.products().length).toBe(0);
  });

  it('debe calcular productos correctamente con computed', () => {
    store.setProducts([
      { currentStock: 10, unitPrice: 5 } as any,
      { currentStock: 2, unitPrice: 10 } as any
    ]);

    expect(store.totalInventoryValue()).toBe(10 * 5 + 2 * 10);
  });

  it('debe marcar alertas críticas correctamente', () => {
    store.setAlerts([
      { severity: 'CRITICAL' } as any,
      { severity: 'LOW' } as any
    ]);

    expect(store.criticalAlerts()).toBe(1);
  });

});
