import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { UserService } from '../../modules/core/services';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const userService: jasmine.SpyObj<UserService> = jasmine.createSpyObj('UserService', ['facebookLogin', 'googleLogin']);
  userService.facebookLogin.and.returnValue(Promise.resolve());
  userService.googleLogin.and.returnValue(Promise.resolve());
  const router = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        {
          provide: UserService,
          useValue: userService
        },
        {
          provide: Router,
          useValue: router
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate home after logging in with facebook', fakeAsync(() => {
    component.facebookLogin();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should navigate home after logging in with google', fakeAsync(() => {
    component.googleLogin();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));
});
