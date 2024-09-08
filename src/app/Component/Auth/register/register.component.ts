import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/Services/authenticate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user = {
    firstName: '',
    lastName: '',
    username:'',
    password:'',
    email: '',
    nameCompany: '',
    phone: ''
  };

  constructor(private userService: AuthenticateService,private router: Router) {}

  onSubmit() {
    this.userService.createUser(this.user).subscribe(
      (response) => {
        console.log('User created successfully:', response);
        this.router.navigate(['/signin'])
      },
      (error) => {
        console.error('Error creating user:', error);
      }
    );
  }
}