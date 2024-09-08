import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUserModel } from '../Model/CreateUserModel';
@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string, rememberMe :false): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>('http://localhost:5022/api/AuthCustomer/login', { username, password ,rememberMe}, { headers, withCredentials: true });
  }
  createUser(user: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>('http://localhost:5022/api/AuthCustomer/register', user, { headers, withCredentials: true });
  }
  
  logout(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>('http://localhost:5022/api/Authentication/logout', {},{ headers, withCredentials: true });
  }

  forgotPassword(email: string) {
    return this.http.post<any>('http://localhost:5022/api/User/forgot-password', { email });
  }
  resetPassword(token: string, newPassword: string) {
    return this.http.post<any>('http://localhost:5022/api/User/reset-password', { token, newPassword });
  }

  getMyProfile(): Observable<CreateUserModel> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<CreateUserModel>('http://localhost:5022/api/User/GetProfileCustomer', { headers, withCredentials: true });
  }
}
