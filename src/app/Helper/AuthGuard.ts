import { Injectable } from '@angular/core';
 import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookiesService } from '../Services/Cookies/cookies.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private cookiesService: CookiesService, private router: Router) {}

    canActivate(): boolean {
      if (this.cookiesService.isAuthenticated()){
        return true;
      }
      
      else {
        this.router.navigate(['/signin']);
        return false;
      }
    }

  }
