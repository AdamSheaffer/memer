import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './';
import { UserService } from '../modules/core/services';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  const userService = { user$: of({}) };
  const router: jasmine.SpyObj<Router> = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {
          provide: UserService,
          useValue: userService
        },
        {
          provide: Router,
          useValue: router
        }
      ]
    });
    guard = TestBed.get(AuthGuard);
  });

  it('expect service to instantiate', () => {
    expect(guard).toBeTruthy();
  });

  it('allows authenticated users', (done: DoneFn) => {
    const service = TestBed.get(UserService);
    const user = { uid: '123' };
    service.user$ = of(user);

    guard.canActivate().subscribe(isAllowed => {
      expect(isAllowed).toBe(true);
      done();
    });
  });

  it('redirects and rejects unauthenticated players', (done: DoneFn) => {
    const service = TestBed.get(UserService);
    service.user$ = of(null);

    guard.canActivate().subscribe(isAllowed => {
      expect(isAllowed).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});
