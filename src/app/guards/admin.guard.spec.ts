import { TestBed } from '@angular/core/testing';
import { AdminGuard } from './';
import { UserService } from '../modules/core/services';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  const userService = { user$: of({}) };
  const router: jasmine.SpyObj<Router> = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
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
    guard = TestBed.get(AdminGuard);
  });

  it('expect service to instantiate', () => {
    expect(guard).toBeTruthy();
  });

  it('allows access for admin users', (done: DoneFn) => {
    const service = TestBed.get(UserService);
    service.user$ = of({
      roles: {
        player: true,
        admin: true,
        editor: true
      }
    });

    guard.canActivate().subscribe(isAllowed => {
      expect(isAllowed).toBe(true);
      done();
    });
  });

  it('redirects and rejects regular players', (done: DoneFn) => {
    const service = TestBed.get(UserService);
    service.user$ = of({
      roles: {
        player: true
      }
    });

    guard.canActivate().subscribe(isAllowed => {
      expect(isAllowed).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/404']);
      done();
    });
  });

  it('redirects and rejects unauthenticated players', (done: DoneFn) => {
    const service = TestBed.get(UserService);
    service.user$ = of(null);

    guard.canActivate().subscribe(isAllowed => {
      expect(isAllowed).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/404']);
      done();
    });
  });
});
