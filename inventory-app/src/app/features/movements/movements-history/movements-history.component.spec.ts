import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MovementHistoryComponent } from './movements-history.component';
import { MovementService } from '../../../core/services/movement.service';

describe('MovementHistoryComponent', () => {

  let component: MovementHistoryComponent;
  let fixture: ComponentFixture<MovementHistoryComponent>;

  const movementServiceMock = {
    getHistory: jasmine.createSpy('getHistory').and.returnValue(
      of([])
    )
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [MovementHistoryComponent],
      providers: [
        {
          provide: MovementService,
          useValue: movementServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovementHistoryComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('productId', 1);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
