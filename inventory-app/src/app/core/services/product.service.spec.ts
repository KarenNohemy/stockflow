import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {

  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch inventory summary', () => {

    const mockResponse = {
      totalInventoryValue: 100,
      totalProducts: 1,
      totalUnits: 10,
      lowStockProducts: 0
    };

    service.getInventorySummary().subscribe((res: any) => {
      expect(res.totalProducts).toBe(1);
      expect(res.totalInventoryValue).toBe(100);
    });

    const req = httpMock.expectOne((r) =>
      r.url.includes('/products/summary')
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

});
