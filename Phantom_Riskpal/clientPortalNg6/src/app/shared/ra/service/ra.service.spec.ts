import { TestBed } from '@angular/core/testing';

import { RaService } from './ra.service';

describe('RaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RaService = TestBed.get(RaService);
    expect(service).toBeTruthy();
  });
});
