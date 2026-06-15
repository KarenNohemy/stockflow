import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertsComponent } from './alerts.component';
import { InventoryStore } from '../../core/store/inventory.store';

describe('AlertsComponent', () => {

  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;

const storeMock = {
  loadAlerts: jasmine.createSpy('loadAlerts'),
  loading: jasmine.createSpy().and.returnValue(false),
  alerts: jasmine.createSpy().and.returnValue([]),
  toastMessage: jasmine.createSpy().and.returnValue(null)
};

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [AlertsComponent],
      providers: [
        {
          provide: InventoryStore,
          useValue: storeMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load alerts on init', () => {
    expect(storeMock.loadAlerts).toHaveBeenCalled();
  });

});
