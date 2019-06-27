import { TestBed, inject } from '@angular/core/testing';

import { CustomerApiService } from './customer-api.service';

describe('CustomerApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerApiService]
    });
  });

  it('should be created', inject([CustomerApiService], (service: CustomerApiService) => {
    expect(service).toBeTruthy();
  }));
});
