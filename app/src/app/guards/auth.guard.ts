import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../@core/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService, 
        private router: Router)
    {}

    async canActivate() {
        if (this.authService.hasToken()) {
            return true;
        }
        else {
            this.authService.logout();
            return false;
        }
    }

}
