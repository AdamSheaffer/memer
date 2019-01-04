import { TestBed } from '@angular/core/testing';
import { NotAuthGuard } from './';
import { AuthService } from '../modules/core/services';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('NotAuthGuard', () => {
  let guard: NotAuthGuard;
  const authService = { user$: of({}) };
  const router: jasmine.SpyObj<Router> = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotAuthGuard,
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
    guard = TestBed.get(NotAuthGuard);
  });

  it('expect service to instantiate', () => {
    expect(guard).toBeTruthy();
  });

  it('rejects authenticated users', (done: DoneFn) => {
    const service = TestBed.get(AuthService);
    const user = { uid: '123' };
    service.user$ = of(user);

    guard.canActivate().subscribe(allowed => {
      expect(allowed).toBe(true);
      done();
    });
  });

  it('allows unauthenticated players', (done: DoneFn) => {
    const service = TestBed.get(AuthService);
    service.user$ = of(null);

    guard.canActivate().subscribe(isAllowed => {
      expect(isAllowed).toBe(false);
      done();
    });
  });
});
