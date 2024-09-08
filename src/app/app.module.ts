import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Component/Auth/login/login.component';
import { RegisterComponent } from './Component/Auth/register/register.component';
import { FooterComponent } from './Component/footer/footer.component';
import { HeaderComponent } from './Component/header/header.component';
import { HomeComponent } from './Component/home/home.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormComponent } from './Component/form/form.component';
import { CookiesService } from './Services/Cookies/cookies.service';
import { AuthGuard } from './Helper/AuthGuard';
import { NotAuthenticatedGuard } from './Helper/NotAuthenticatedGuard';
import { ErrorInterceptor } from './Helper/ErrorInterceptor';
import { ContactComponent } from './Component/contact/contact.component';
import { AboutUsComponent } from './Component/about-us/about-us.component';
import { ListResponsesComponent } from './Component/list-responses/list-responses.component';
import { BlogComponent } from './Component/blog/blog.component';
import { StarRatingComponent } from './Component/star-rating/star-rating.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { ForgetpasswordComponent } from './Component/Auth/Password/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './Component/Auth/Password/resetpassword/resetpassword.component';
import { ProfileComponent } from './Component/Auth/profile/profile.component';
import { ChatHubComponent } from './Component/chat-hub/chat-hub.component';
import { DemoRequestComponent } from './Component/demo-request/demo-request.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    FormComponent,
    ContactComponent,
    AboutUsComponent,
    ListResponsesComponent,
    BlogComponent,
    StarRatingComponent,
    ForgetpasswordComponent,
    ResetpasswordComponent,
    ProfileComponent,
    ChatHubComponent,
    DemoRequestComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatButtonModule

  ],
  providers: [
    CookiesService,
    AuthGuard,
    NotAuthenticatedGuard,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true, }
  ],  
  bootstrap: [AppComponent]
})
export class AppModule { }
