
import { Injectable } from '@angular/core';
 import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookiesService } from '../Services/Cookies/cookies.service';

@Injectable({ providedIn: 'root' })
export class AccessDenied implements CanActivate {
    constructor(private cookiesService: CookiesService, private router: Router) {}

    canActivate(): boolean {
     
     if(this.hasAccessToUsers())
    {
      return true
    } 
      else {
        this.router.navigate(['/accessDenied'])
        return false;
      }
    }

    private hasAccessToUsers(): boolean {
      const userRole = this.cookiesService.getUserRole();
      return userRole == 'Admin' || userRole == 'Manager' ;
    }
  }