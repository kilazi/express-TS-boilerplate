import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import {HttpService} from '../http.service';
import {GlobalService} from '../global.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private http: HttpService,
        private globalService: GlobalService
    ) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        let auth = localStorage.getItem('auth');
        if (auth) {            
            return true;
        } else {
            this.router.navigateByUrl('/login');
            return false;
        }
    }
}
