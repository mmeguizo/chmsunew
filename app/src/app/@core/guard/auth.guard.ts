import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate() {
    if (this.authService.hasToken()) {
      return true;
    } else {
      // this.router.navigate(['login']);
      this.authService.logout();
      return false;
    }
  }
}
