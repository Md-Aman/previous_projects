import { TestBed } from '@angular/core/testing';

import { ToastarService } from './toastar.service';

describe('ToastarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastarService = TestBed.get(ToastarService);
    expect(service).toBeTruthy();
  });
});
