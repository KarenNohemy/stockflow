import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedStatsComponent } from './advanced-stats.component';

describe('AdvancedStatsComponent', () => {
  let component: AdvancedStatsComponent;
  let fixture: ComponentFixture<AdvancedStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
