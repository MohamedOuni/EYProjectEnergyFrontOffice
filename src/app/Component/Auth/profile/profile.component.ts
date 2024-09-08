import { Component, OnInit } from '@angular/core';
import { CreateUserModel } from 'src/app/Model/CreateUserModel';
import { Profile } from 'src/app/Model/Profile';
import { CookiesService } from 'src/app/Services/Cookies/cookies.service';
import { AuthenticateService } from 'src/app/Services/authenticate.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user!: Profile 

  constructor(private userService: AuthenticateService) {
  }

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe(
      (user: CreateUserModel) => {
        this.user = user;
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }


}