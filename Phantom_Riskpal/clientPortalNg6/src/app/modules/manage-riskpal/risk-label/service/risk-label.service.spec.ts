import { TestBed } from '@angular/core/testing';

import { RiskLabelService } from './risk-label.service';

describe('RiskLabelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RiskLabelService = TestBed.get(RiskLabelService);
    expect(service).toBeTruthy();
  });
});
