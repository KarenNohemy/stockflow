import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/enviroment';

describe('ApiService', () => {

  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // =========================
  // GET
  // =========================
  it('should perform GET request', () => {

    service.get('/products').subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/products`
    );

    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  // =========================
  // POST
  // =========================
  it('should perform POST request', () => {

    const body = { name: 'test' };

    service.post('/products', body).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/products`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush({});
  });

  // =========================
  // PUT
  // =========================
  it('should perform PUT request', () => {

    const body = { name: 'updated' };

    service.put('/products/1', body).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/products/1`
    );

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);

    req.flush({});
  });

  // =========================
  // DELETE
  // =========================
  it('should perform DELETE request', () => {

    service.delete('/products/1').subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/products/1`
    );

    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

});
