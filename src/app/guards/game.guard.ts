
import { tap, map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GameService } from '../modules/core/services';
import { Observable } from 'rxjs';

@Injectable()
export class GameGuard implements CanActivate {
  constructor(private router: Router, private gameService: GameService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const gameId = route.params['id'];

    return this.gameService.getGameById(gameId).pipe(
      take(1),
      map(game => {
        return game.payload.exists;
      }),
      tap(gameExists => {
        if (!gameExists) {
          this.router.navigate(['/404']);
          return false;
        }
        return true;
      }));
  }
}
