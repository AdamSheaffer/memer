import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GifOptionsComponent } from './gif-options.component';
import { Theme, ThemeService } from '../../../../core/services';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GifOptionsComponent', () => {
  let component: GifOptionsComponent;
  let fixture: ComponentFixture<GifOptionsComponent>;
  let themeService;

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
    themeService = {
      theme: Theme.LIGHT,
      setDark() {
        this.theme = Theme.DARK;
      }
    };
  });

  it('should create', fakeAsync(() => {
    component.ngOnInit();
    tick(1000); // calling tick and destory for time interval
    component.ngOnDestroy();
    fixture.whenStable().then(() => {
      expect(component).toBeTruthy();
    });
  }));

  it('should label elipsis', fakeAsync(() => {
    component.selectingIndicator = 'SELECTING...';
    component.ngOnInit();
    tick(1000);
    component.ngOnDestroy();
    expect(component.selectingIndicator).toBe('SELECTING   ');
  }));

  it('should compute the theme', () => {
    expect(component.isDarkTheme).toBe(false);
    const service = fixture.debugElement.injector.get(ThemeService);
    service.setDark();
    expect(component.isDarkTheme).toBe(true);
  });

  it('next should not do anything if it is not players turn', () => {
    component.imageIndex = 0;
    component.playerCanSelect = false;
    component.next();

    expect(component.imageIndex).toBe(0);
  });

  it('previous should not do anything if it is not players turn', () => {
    component.imageIndex = 0;
    component.playerCanSelect = false;
    component.previous();

    expect(component.imageIndex).toBe(0);
  });

  it('should go to next option', () => {
    component.options = ['1', '2', '3'];
    component.playerCanSelect = true;
    component.imageIndex = 0;
    component.next();
    expect(component.imageIndex).toBe(1);
  });

  it('should go to first option if on last', () => {
    component.options = ['1', '2', '3'];
    component.playerCanSelect = true;
    component.imageIndex = component.options.length - 1;
    component.next();
    expect(component.imageIndex).toBe(0);
  });

  it('should go to previous option', () => {
    component.options = ['1', '2', '3'];
    component.playerCanSelect = true;
    component.imageIndex = 1;
    component.previous();
    expect(component.imageIndex).toBe(0);
  });

  it('should go to last option if on first', () => {
    component.options = ['1', '2', '3'];
    component.playerCanSelect = true;
    component.imageIndex = 0;
    component.previous();
    expect(component.imageIndex).toBe(2);
  });

  it('select should do nothing if not players turn', () => {
    spyOn(component.optionSelect, 'emit');

    component.playerCanSelect = false;
    component.selectOption('1');
    expect(component.optionSelect.emit).not.toHaveBeenCalled();
  });

  it('select should emit event', () => {
    spyOn(component.optionSelect, 'emit');

    component.playerCanSelect = true;
    component.selectOption('1');
    expect(component.optionSelect.emit).toHaveBeenCalled();
  });
});
