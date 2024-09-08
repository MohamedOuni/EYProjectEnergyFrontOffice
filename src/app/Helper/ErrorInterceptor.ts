import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { CookiesService } from '../Services/Cookies/cookies.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private cookiesServices: CookiesService ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
      const userRole = this.cookiesServices.getUserRole();
      if (userRole) {
        req = req.clone({
          setHeaders: {
            UserRole: userRole
          }
        });
      }
      return next.handle(req);
    }
}