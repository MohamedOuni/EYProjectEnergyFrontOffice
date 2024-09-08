import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemoRequestService {
  private apiUrl = 'http://localhost:5022/api/DemoRequest';

  constructor(private http: HttpClient) {}

  createDemoRequest(demoRequest: any): Observable<any> {
    return this.http.post(this.apiUrl, demoRequest);
  }
}
