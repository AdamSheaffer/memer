import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService, GameService, SettingsService } from '../../modules/core/services';
import { Router } from '@angular/router';
import { MomentModule } from 'ngx-moment';
import { FromFBDatePipe } from '../../modules/shared/pipes';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const authService = jasmine.createSpyObj('AuthService', ['getPlayer']);
  const gameService = jasmine.createSpyObj('GameService', ['getOpenGameList']);
  const router = jasmine.createSpyObj('Router', ['navigate']);
  const settingsService = { safeForWork: false };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MomentModule],
      declarations: [ HomeComponent, FromFBDatePipe  ],
      providers: [
        {
          provide: AuthService,
          useValue: authService
        },
        {
          provide: GameService,
          useValue: gameService
        },
        {
          provide: Router,
          useValue: router
        },
        {
          provide: SettingsService,
          useValue: settingsService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
