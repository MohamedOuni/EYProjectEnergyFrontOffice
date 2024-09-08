import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticateService } from 'src/app/Services/authenticate.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  constructor(private userService: AuthenticateService, private route: ActivatedRoute, private router:Router) {}


  resetData = { token: '', newPassword: '' };
  timer: any;
  elapsedTime: number = 120;


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const expiration = params['expiration'];
      if (expiration) {
        const expirationDate = new Date(expiration);
        const now = new Date();
        this.elapsedTime = Math.floor((expirationDate.getTime() - now.getTime()) / 1000);
        this.startTimer();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  submitReset() {
    if (!this.resetData.token || !this.resetData.newPassword) {
      alert('Both fields are required.');
      return;
    }

    this.userService.resetPassword(this.resetData.token, this.resetData.newPassword).subscribe({
      next: (res) => {
        this.router.navigate(['/signin'])
        console.log(res.message);
        alert('Password has been successfully reset.');
      },
      error: (err) => {
        console.error(err.error.message); 
        alert(err.error.message || 'An error occurred while resetting your password.');
      }
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.elapsedTime--;
      if (this.elapsedTime <= 0) {
        clearInterval(this.timer);
        this.elapsedTime = 0;
        alert('The reset token has expired. Please request a new one.');
      }
    }, 1000);
  }

  getFormattedTime(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }


}
