import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/Services/authenticate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  
  isLoginFailed = false;
  errorMessage = '';
  form: any = {
    userName: null,
    password: null,
    rememberMe: false 
  };

  constructor(private authService: AuthenticateService, private router: Router) { }

  onSubmit(): void {
    const { username, password,rememberMe } = this.form;
    this.authService.login(username, password,rememberMe)
      .subscribe(response => {
        console.log('Connexion réussie !', response);
        this.router.navigate(['/home']);
      }, error => {
        this.isLoginFailed = true;
        this.errorMessage = 'Invalid username or password';
        console.error('Erreur lors de la connexion :', error);
      });
  }

  updateRememberMe(): void {
    this.form.rememberMe = true;
  }
}

