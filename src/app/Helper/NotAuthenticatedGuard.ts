import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookiesService } from '../Services/Cookies/cookies.service';

@Injectable({
  providedIn: 'root'
})
export class NotAuthenticatedGuard implements CanActivate {

  constructor(private cookiesService: CookiesService, private router: Router) {}

  canActivate(): boolean {
    if (!this.cookiesService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/home']); 
      return false;
    }
  }
}