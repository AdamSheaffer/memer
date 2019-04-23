import { TestBed, inject } from '@angular/core/testing';

import { WebworkerService } from './web-worker.service';

describe('WebworkerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebworkerService]
    });
  });

  it('should be created', inject([WebworkerService], (service: WebworkerService) => {
    expect(service).toBeTruthy();
  }));
});
