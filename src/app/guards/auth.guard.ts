import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) { }

    canActivate(): Observable<boolean> {
        return this.authService.authState()
            .take(1)
            .map(authState => !!authState)
            .do(authenticated => {
                if (!authenticated) {
                    this.router.navigate(['/login']);
                    return false;
                }
                return true;
            });
    }

}