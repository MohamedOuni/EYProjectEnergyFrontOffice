import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Component/home/home.component';
import { LoginComponent } from './Component/Auth/login/login.component';
import { RegisterComponent } from './Component/Auth/register/register.component';
import { FormComponent } from './Component/form/form.component';
import { AuthGuard } from './Helper/AuthGuard';
import { NotAuthenticatedGuard } from './Helper/NotAuthenticatedGuard';
import { ContactComponent } from './Component/contact/contact.component';
import { AboutUsComponent } from './Component/about-us/about-us.component';
import { ListResponsesComponent } from './Component/list-responses/list-responses.component';
import { BlogComponent } from './Component/blog/blog.component';
import { ForgetpasswordComponent } from './Component/Auth/Password/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './Component/Auth/Password/resetpassword/resetpassword.component';
import { ProfileComponent } from './Component/Auth/profile/profile.component';
import { ChatHubComponent } from './Component/chat-hub/chat-hub.component';
import { DemoRequestComponent } from './Component/demo-request/demo-request.component';

const routes: Routes = [
  {path:'home', component:HomeComponent,},
  {path:'signin', component:LoginComponent,canActivate: [NotAuthenticatedGuard]},
  {path:'signup', component:RegisterComponent ,canActivate: [NotAuthenticatedGuard]},
  {path:'form', component:FormComponent,canActivate: [AuthGuard]},
  {path:'contact', component:ContactComponent},  
  {path:'listresponses', component:ListResponsesComponent},  
  {path:'blog', component:BlogComponent},  
  {path:'forgetpassword', component:ForgetpasswordComponent},  
  {path:'resetpassword', component:ResetpasswordComponent},  
  {path:'profile', component:ProfileComponent},  
  {path:'aboutus', component:AboutUsComponent},
  {path:'chatEY', component:ChatHubComponent},
  {path:'Demonstration', component:DemoRequestComponent},

  {path:'**' , pathMatch:'full' , redirectTo : '/home'},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
