import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookiesService } from 'src/app/Services/Cookies/cookies.service';
import { AuthenticateService } from 'src/app/Services/authenticate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private cookiesService : CookiesService , private authService: AuthenticateService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        this.router.navigate(['/home'])
      },
      (error) => {
        console.error('Error when disconnecting:', error);       
      }
    );
  }
  hasAccessToUsers(): boolean {
    const userRole = this.cookiesService.getUserRole();
    return userRole == 'Customer';
  }  
}
