import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { httpErrorInterceptor } from './http-error.interceptor';
import { InventoryStore } from '../store/inventory.store';

describe('httpErrorInterceptor', () => {

  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let storeMock: jasmine.SpyObj<InventoryStore>;

  beforeEach(() => {

    storeMock = jasmine.createSpyObj('InventoryStore', [], {
      toastMessage: {
        set: jasmine.createSpy('set')
      } as any
    });

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([httpErrorInterceptor])
        ),
        provideHttpClientTesting(),
        { provide: InventoryStore, useValue: storeMock }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle 404 error', () => {

    httpClient.get('/test').subscribe({
      error: () => {}
    });

    const req = httpMock.expectOne('/test');

    req.flush(
      { message: 'Not found' },
      { status: 404, statusText: 'Not Found' }
    );

    expect(storeMock.toastMessage.set).toHaveBeenCalledWith({
      type: 'error',
      text: 'Not found'
    });
  });

  it('should handle 500 error', () => {

    httpClient.get('/test').subscribe({
      error: () => {}
    });

    const req = httpMock.expectOne('/test');

    req.flush(
      {},
      { status: 500, statusText: 'Server Error' }
    );

    expect(storeMock.toastMessage.set).toHaveBeenCalled();
  });

  it('should handle network error (status 0)', () => {

    httpClient.get('/test').subscribe({
      error: () => {}
    });

    const req = httpMock.expectOne('/test');

    req.error(new ProgressEvent('Network error'), { status: 0 });

    expect(storeMock.toastMessage.set).toHaveBeenCalledWith({
      type: 'error',
      text: 'No hay conexión con el servidor'
    });
  });

});
