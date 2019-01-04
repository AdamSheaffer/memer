import { TestBed } from '@angular/core/testing';
import { AdminGuard } from './';
import { AuthService } from '../modules/core/services';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  const authService = { user$: of({}) };
  const router: jasmine.SpyObj<Router> = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        {
          provide: AuthService,
          useValue: authService
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
    const service = TestBed.get(AuthService);
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
    const service = TestBed.get(AuthService);
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
    const service = TestBed.get(AuthService);
    service.user$ = of(null);

    guard.canActivate().subscribe(isAllowed => {
      expect(isAllowed).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/404']);
      done();
    });
  });
});
