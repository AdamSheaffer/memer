import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AuthService, ThemeService } from '../../../core/services';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ClarityModule } from '@clr/angular';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const router = jasmine.createSpyObj('Router', ['createTreeUrl', 'navigate']);
  const route = { params: of({ dark: 'true' }) };
  const location = jasmine.createSpyObj('Location', ['go']);
  const themeService = jasmine.createSpyObj('ThemeService', ['changeTheme', 'setDark']);
  const authService = {
    getPlayer() {
      return { username: 'MEMER' };
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule],
      declarations: [ HeaderComponent ],
      providers: [
        {
          provide: AuthService,
          useValue: authService
        },
        {
          provide: ThemeService,
          useValue: themeService
        },
        {
          provide: Router,
          useValue: router
        },
        {
          provide: ActivatedRoute,
          useValue: route
        },
        {
          provide: Location,
          useValue: location
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
