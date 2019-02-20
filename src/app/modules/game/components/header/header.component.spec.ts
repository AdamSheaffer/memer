import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { UserService, ThemeService, Theme } from '../../../core/services';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ClarityModule } from '@clr/angular';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const router = jasmine.createSpyObj('Router', ['createUrlTree', 'navigate']);
  router.createUrlTree.and.returnValue({});
  const route = { params: of({ dark: 'true' }) };
  const location = jasmine.createSpyObj('Location', ['go']);
  const themeService = {
    theme: Theme.LIGHT,
    changeTheme: () => {},
    setDark: () => {}
  };

  const userService = {
    getPlayer() {
      return { username: 'MEMER' };
    },
    logout: () => Promise.resolve()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule],
      declarations: [ HeaderComponent ],
      providers: [
        {
          provide: UserService,
          useValue: userService
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

  it('should compute theme', () => {
    expect(component.isLightTheme).toBe(true);
  });

  it('should set theme', () => {
    const service = fixture.debugElement.injector.get(ThemeService);
    spyOn(service, 'changeTheme');
    component.changeTheme();
    expect(service.changeTheme).toHaveBeenCalled();
  });

  it('should navigate back to login when logging out', fakeAsync(() => {
    const routerService = fixture.debugElement.injector.get(Router);
    component.logout();
    tick();
    expect(routerService.navigate).toHaveBeenCalledWith(['login']);
  }));
});
