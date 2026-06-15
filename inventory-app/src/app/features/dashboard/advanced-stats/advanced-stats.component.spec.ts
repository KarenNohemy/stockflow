import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedStatsComponent } from './advanced-stats.component';
import { InventoryStore } from '../../../core/store/inventory.store';

describe('AdvancedStatsComponent', () => {

  let fixture: ComponentFixture<AdvancedStatsComponent>;
  let storeMock: any;

  beforeEach(async () => {

    storeMock = {
      inventorySummary: jasmine.createSpy().and.returnValue({
        totalInventoryValue: 1000,
        totalProducts: 2,
        totalUnits: 40,
        lowStockProducts: 3
      })
    };

    await TestBed.configureTestingModule({
      imports: [AdvancedStatsComponent],
      providers: [
        { provide: InventoryStore, useValue: storeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedStatsComponent);
    fixture.detectChanges();
  });

  it('should calculate average product value', () => {

    const component = fixture.componentInstance;

    // 1000 / 2 = 500
    expect(component.avgProductValue()).toBe(500);
  });

  it('should return low stock products from summary', () => {

    const component = fixture.componentInstance;

    expect(component.lowStockCount()).toBe(3);
  });

  it('should return total units from summary', () => {

    const component = fixture.componentInstance;

    expect(component.totalUnits()).toBe(40);
  });

});
