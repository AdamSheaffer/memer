import { TestBed } from '@angular/core/testing';
import { NotAuthGuard } from './';
import { UserService } from '../modules/core/services';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('NotAuthGuard', () => {
  let guard: NotAuthGuard;
  const userService = { user$: of({}) };
  const router: jasmine.SpyObj<Router> = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotAuthGuard,
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
    guard = TestBed.get(NotAuthGuard);
  });

  it('expect service to instantiate', () => {
    expect(guard).toBeTruthy();
  });

  it('rejects authenticated users', (done: DoneFn) => {
    const service = TestBed.get(UserService);
    const user = { uid: '123' };
    service.user$ = of(user);

    guard.canActivate().subscribe(allowed => {
      expect(allowed).toBe(true);
      done();
    });
  });

  it('allows unauthenticated players', (done: DoneFn) => {
    const service = TestBed.get(UserService);
    service.user$ = of(null);

    guard.canActivate().subscribe(isAllowed => {
      expect(isAllowed).toBe(false);
      done();
    });
  });
});
