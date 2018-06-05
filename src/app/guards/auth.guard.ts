
import { tap, map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../modules/core/services';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) { }

    canActivate(): Observable<boolean> {
        return this.authService.user$.pipe(
            take(1),
            map(authState => {
                return !!authState;
            }),
            tap(authenticated => {
                if (!authenticated) {
                    this.router.navigate(['/login']);
                    return false;
                }
                return true;
            }), );
    }
}
