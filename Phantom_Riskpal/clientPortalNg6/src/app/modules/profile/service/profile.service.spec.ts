import { TestBed } from '@angular/core/testing';

import { UserFeatureService } from './user-feature.service';

describe('UserFeatureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserFeatureService = TestBed.get(UserFeatureService);
    expect(service).toBeTruthy();
  });
});
