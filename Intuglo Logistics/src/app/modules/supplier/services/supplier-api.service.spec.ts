import { TestBed, inject } from '@angular/core/testing';

import { SupplierApiService } from './supplier-api.service';

describe('SupplierApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupplierApiService]
    });
  });

  it('should be created', inject([SupplierApiService], (service: SupplierApiService) => {
    expect(service).toBeTruthy();
  }));
});
