import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AlertService } from './alert.service';
import { environment } from '../../../environments/enviroment';

describe('AlertService', () => {

  let service: AlertService;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlertService]
    });

    service = TestBed.inject(AlertService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch alerts', () => {

    const mockResponse = [
      { productId: 1, severity: 'CRITICAL' },
      { productId: 2, severity: 'LOW' }
    ];

    service.getAlerts().subscribe(res => {
      expect(res.length).toBe(2);
      expect(res[0].severity).toBe('CRITICAL');
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/alerts`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

});
