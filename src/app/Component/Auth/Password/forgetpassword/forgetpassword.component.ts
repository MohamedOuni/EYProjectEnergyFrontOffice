import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/Services/authenticate.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {

  email: string = '';


  constructor(private userService: AuthenticateService, private router: Router) {}

  ngOnInit(): void {
    
  }

  submitForm() {
    this.userService.forgotPassword(this.email).subscribe({
      next: (response: any) => {
        this.router.navigate(['/resetpassword'], { queryParams: { expiration: response.expiration } });
        console.log('Password reset email sent successfully');
      },
      error: error => {
        console.error('Error sending password reset email:', error);
      }
    });
  }

}
