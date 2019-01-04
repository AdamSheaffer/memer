import { TestBed, inject } from '@angular/core/testing';

import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsService]
    });
  });

  it('should be created', inject([SettingsService], (service: SettingsService) => {
    expect(service).toBeTruthy();
  }));

  it('should set default to nsfw', inject([SettingsService], (service: SettingsService) => {
    expect(service.safeForWork).toBe(false);
  }));

  it('should set toggle to sfw', inject([SettingsService], (service: SettingsService) => {
    service.setSafeForWorkMode(true);
    expect(service.safeForWork).toBe(true);
  }));
});
