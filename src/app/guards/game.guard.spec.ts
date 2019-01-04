import { TestBed } from '@angular/core/testing';
import { GameGuard } from './';
import { of } from 'rxjs';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot } from '@angular/router';
import { GameService } from '../modules/core/services';

describe('AuthGuard', () => {
  let guard: GameGuard;
  const gameService: jasmine.SpyObj<GameService> = jasmine.createSpyObj('GameService', ['getGameById']);
  const router: jasmine.SpyObj<Router> = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GameGuard,
        {
          provide: GameService,
          useValue: gameService
        },
        {
          provide: Router,
          useValue: router
        }
      ]
    });
    guard = TestBed.get(GameGuard);
  });

  it('expect service to instantiate', () => {
    expect(guard).toBeTruthy();
  });

  it('allows navigation to existing game', (done: DoneFn) => {
    gameService.getGameById.and.returnValue(of({
      payload: { exists: true }
    }));
    const route = new ActivatedRouteSnapshot();
    route.params = { id: 'existing-game' };

    guard.canActivate(route, null).subscribe(isAllowed => {
      expect(isAllowed).toBe(true);
      done();
    });
  });

  it('redirects and rejects non existing games', (done: DoneFn) => {
    gameService.getGameById.and.returnValue(of({
      payload: { exists: false }
    }));
    const route = new ActivatedRouteSnapshot();
    route.params = { id: 'non-existing-game' };

    guard.canActivate(route, null).subscribe(isAllowed => {
      expect(isAllowed).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/404']);
      done();
    });
  });
});
