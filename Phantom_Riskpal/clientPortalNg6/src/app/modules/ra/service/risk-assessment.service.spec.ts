import { TestBed } from '@angular/core/testing';

import { RiskAssessmentService } from './risk-assessment.service';

describe('RiskAssessmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RiskAssessmentService = TestBed.get(RiskAssessmentService);
    expect(service).toBeTruthy();
  });
});
