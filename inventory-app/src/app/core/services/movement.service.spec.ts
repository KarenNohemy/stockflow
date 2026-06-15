import { TestBed } from '@angular/core/testing';
import { MovementService } from './movement.service';
import { ApiService } from './api.service';

describe('MovementService', () => {

  let service: MovementService;
  let apiMock: jasmine.SpyObj<ApiService>;

  beforeEach(() => {

    apiMock = jasmine.createSpyObj('ApiService', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [
        MovementService,
        { provide: ApiService, useValue: apiMock }
      ]
    });

    service = TestBed.inject(MovementService);
  });

  it('should create movement', () => {

    const mockData = { productId: 1, quantity: 10 };

    apiMock.post.and.returnValue({} as any);

    service.createMovement(mockData);

    expect(apiMock.post).toHaveBeenCalledWith(
      '/movements',
      mockData
    );
  });

  it('should get movement history', () => {

    const productId = 5;

    apiMock.get.and.returnValue({} as any);

    service.getHistory(productId);

    expect(apiMock.get).toHaveBeenCalledWith(
      `/movements/${productId}/history`
    );
  });

});
