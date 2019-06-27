import { TestBed, inject } from '@angular/core/testing';

import { CustomAgentApiService } from './custom-agent-api.service';

describe('CustomAgentApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomAgentApiService]
    });
  });

  it('should be created', inject([CustomAgentApiService], (service: CustomAgentApiService) => {
    expect(service).toBeTruthy();
  }));
});
