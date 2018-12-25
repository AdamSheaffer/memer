import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GifOptionsComponent } from './gif-options.component';
import { Theme, ThemeService } from '../../../../core/services';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GifOptionsComponent', () => {
  let component: GifOptionsComponent;
  let fixture: ComponentFixture<GifOptionsComponent>;
  const themeService = { theme: Theme.LIGHT };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ GifOptionsComponent ],
      providers: [
        {
          provide: ThemeService,
          useValue: themeService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GifOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
