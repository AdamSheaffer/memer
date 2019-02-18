import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundTimerComponent } from './round-timer.component';
import { Theme, ThemeService } from '../../../core/services';
import { GiphyService } from '../../services';

describe('RoundTimerComponent', () => {
  let component: RoundTimerComponent;
  let fixture: ComponentFixture<RoundTimerComponent>;
  let themeService;
  let giphyService: jasmine.SpyObj<GiphyService>;

  beforeEach(async(() => {
    themeService = { theme: Theme.LIGHT };
    giphyService = jasmine.createSpyObj<GiphyService>('giphyService', ['getWildcard']);
    giphyService.getWildcard.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      declarations: [ RoundTimerComponent ],
      providers: [
        {
          provide: ThemeService,
          useValue: themeService
        },
        {
          provide: GiphyService,
          useValue: giphyService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
