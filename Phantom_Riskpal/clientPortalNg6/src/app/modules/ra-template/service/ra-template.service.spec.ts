import { TestBed } from '@angular/core/testing';

import { RaTemplateService } from './ra-template.service';

describe('RaTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RaTemplateService = TestBed.get(RaTemplateService);
    expect(service).toBeTruthy();
  });
});
