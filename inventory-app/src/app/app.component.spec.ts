import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { InventoryStore } from './core/store/inventory.store';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', () => {

  beforeEach(async () => {

    const storeMock = {
      toastMessage: signal(null)
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: InventoryStore, useValue: storeMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('should render navbar and router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should display toast when store has message', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const store = TestBed.inject(InventoryStore);

    store.toastMessage.set({
      type: 'error',
      text: 'Test error'
    });

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Test error');
  });

});
