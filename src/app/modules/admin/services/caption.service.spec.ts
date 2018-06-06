import { TestBed, inject } from '@angular/core/testing';

import { CaptionService } from './caption.service';

describe('CaptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaptionService]
    });
  });

  it('should be created', inject([CaptionService], (service: CaptionService) => {
    expect(service).toBeTruthy();
  }));
});
