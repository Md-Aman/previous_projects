import { TestBed, inject } from '@angular/core/testing';

import { NotLoggedInService } from './not-logged-in.service';

describe('NotLoggedInService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotLoggedInService]
    });
  });

  it('should ...', inject([NotLoggedInService], (service: NotLoggedInService) => {
    expect(service).toBeTruthy();
  }));
});
