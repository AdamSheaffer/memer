
import { tap, map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../modules/core/services';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) { }

  canActivate(): Observable<boolean> {
    return this.userService.user$.pipe(
      take(1),
      map(user => user && user.roles.admin ? true : false),
      tap(isAdmin => {
        if (!isAdmin) {
          this.router.navigate(['/404']);
          return false;
        }
        return true;
      })
    );
  }
}
