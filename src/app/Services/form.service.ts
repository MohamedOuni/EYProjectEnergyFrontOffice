import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Question } from '../Model/Question';
import { AppForm } from '../Model/AppForm';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  
  private apiUrl = `http://localhost:5022/api/Forms`;

  constructor(private http: HttpClient) {}


  getFormsC(): Observable<AppForm[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<AppForm[]>(this.apiUrl, { headers, withCredentials: true });
  }

getQuestionById(questionId: string): Observable<Question> {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.get<Question>(`${this.apiUrl}/questions/${questionId}`, { headers, withCredentials: true });
}
  getFormC(id: string): Observable<AppForm> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<AppForm>(`${this.apiUrl}/${id}`, { headers, withCredentials: true });
  }
  getFormNameById(formId: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/NameForm/${formId}`, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Error fetching form title for form ID ${formId}:`, error);
        return throwError(error);
      })
    );
  }
  
}