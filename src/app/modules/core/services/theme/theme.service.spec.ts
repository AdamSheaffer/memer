import { TestBed, inject } from '@angular/core/testing';

import { ThemeService, Theme } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
  });

  it('should be created', inject([ThemeService], (service: ThemeService) => {
    expect(service).toBeTruthy();
  }));

  it('should default to light theme', inject([ThemeService], (service: ThemeService) => {
    expect(service.theme).toBe(Theme.LIGHT);
  }));

  it('should toggle themes', inject([ThemeService], (service: ThemeService) => {
    service.changeTheme();
    expect(service.theme).toBe(Theme.DARK);
  }));

  it('should set dark', inject([ThemeService], (service: ThemeService) => {
    service.setDark();
    expect(service.theme).toBe(Theme.DARK);
  }));

  it('should set light', inject([ThemeService], (service: ThemeService) => {
    service.setDark();
    service.setLight();
    expect(service.theme).toBe(Theme.LIGHT);
  }));
});
