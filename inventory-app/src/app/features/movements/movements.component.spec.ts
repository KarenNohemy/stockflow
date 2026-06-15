import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MovementsComponent } from './movements.component';
import { MovementService } from '../../core/services/movement.service';
import { InventoryStore } from '../../core/store/inventory.store';

describe('MovementsComponent', () => {

  let component: MovementsComponent;
  let fixture: ComponentFixture<MovementsComponent>;

  const movementServiceMock = {
    createMovement: jasmine.createSpy('createMovement').and.returnValue(of({})),
    getHistory: jasmine.createSpy('getHistory').and.returnValue(of([]))
  };

  const storeMock = {
    refreshAll: jasmine.createSpy('refreshAll'),
    toastMessage: {
      set: jasmine.createSpy('set')
    }
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [MovementsComponent],
      providers: [
        {
          provide: MovementService,
          useValue: movementServiceMock
        },
        {
          provide: InventoryStore,
          useValue: storeMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovementsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
