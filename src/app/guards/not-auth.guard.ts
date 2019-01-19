import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../modules/core/services';
import { take, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class NotAuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      take(1),
      map(authState => !!authState),
      tap(authenticated => {
        if (!!authenticated) {
          this.router.navigate(['/']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
