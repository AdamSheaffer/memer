import { TestBed, inject } from '@angular/core/testing';

import { RoundPickerService } from './round-picker.service';

describe('RoundPickerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoundPickerService]
    });
  });

  it('should be created', inject([RoundPickerService], (service: RoundPickerService) => {
    expect(service).toBeTruthy();
  }));
});
