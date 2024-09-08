import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ClientResponse } from '../Model/ClientResponse';

@Injectable({
  providedIn: 'root'
})
export class ClientResponsesService {
  private apiUrl = `http://localhost:5022/api/ClientResponses`;
  private apiUrl2 = `http://localhost:5022/api/Files`;
  private apiUrl12 = 'http://localhost:5022/api/Contact/SendMessage';
  private FileApiUrl = 'http://localhost:5022/api/Files';
  private responsesApiUrl = 'http://localhost:5022/api/ClientResponses';
  private apiUrl10 = `http://localhost:5022/api/Forms`;

  constructor(private http: HttpClient) {}

  getFormNameById(formId: string): Observable<string> {
    return this.http.get<{ title: string }>(`${this.apiUrl10}/NameForm/${formId}`, { withCredentials: true }).pipe(
      map(form => form.title),
      catchError((error: HttpErrorResponse) => {
        console.error(`Error fetching form title for form ID ${formId}:`, error);
        return throwError(error);
      })
    );
  }

  getResponses(): Observable<ClientResponse[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<ClientResponse[]>(this.apiUrl, { headers, withCredentials: true });
  }

  getResponsesByFormId(formId: string): Observable<ClientResponse[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<ClientResponse[]>(`${this.apiUrl}/form/${formId}`, { headers, withCredentials: true });
  }

  createResponse(response: ClientResponse, file?: File): Observable<void> {
    const formData = new FormData();
    formData.append('formId', response.formId);
    formData.append('questionId', response.questionId);
    formData.append('responseText', response.responseText);

    if (response.optionId) {
      formData.append('optionId', response.optionId);
    }

    if (file) {
      formData.append('file', file, file.name);
    }

    return this.http.post<void>(this.apiUrl, formData, { withCredentials: true });
  }

  uploadFile(formData: FormData): Observable<{ fileId: string }> {
    return this.http.post<{ fileId: string }>(`${this.apiUrl2}/upload`, formData, {
      withCredentials: true,
      headers: new HttpHeaders().append('Accept', 'application/json')
    });
  }

  updateResponseFile(responseId: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.put<void>(`${this.apiUrl}/updateFile/${responseId}`, formData, { withCredentials: true });
  }

  getClientResponses(): Observable<ClientResponse[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<ClientResponse[]>(`${this.apiUrl}/clientResponses`, {headers, withCredentials: true });
  }

  hasClientResponded(formId: string): Observable<{ hasResponded: boolean }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<{ hasResponded: boolean }>(`${this.apiUrl}/hasResponded/${formId}`, {headers, withCredentials: true });
  }

  getUnfinalizedResponses(formId: string): Observable<ClientResponse[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.get<ClientResponse[]>(`${this.apiUrl}/unfinalizedResponses/${formId}`, {headers, withCredentials: true });
  }

  finalizeResponses(formId: string): Observable<void> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<void>(`${this.apiUrl}/finalize/${formId}`, {}, {headers, withCredentials: true });
  }

  sendContactMessage(message: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.apiUrl12, message, { headers });
  }

  updateResponse(response: ClientResponse): Observable<void> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<void>(`${this.apiUrl}/${response.responseId}`, response, {headers, withCredentials: true });
  }

  downloadFile(fileId: string): Observable<Blob> {
    console.log('Requesting file download with ID:', fileId); // Log for debugging
    return this.http.get(`${this.FileApiUrl}/${fileId}`, { responseType: 'blob' });
  }

  getObjectIdString(id: any): string {
    console.log('Original ID:', id); 
    if (id && typeof id === 'object') {
      if (id.toHexString) {
        return id.toHexString();
      }
      if (id.$oid) {
        return id.$oid;
      }
      if (id.timestamp && id.machine && id.pid && id.increment) {
        const hexString = new Date(id.timestamp * 1000).getTime().toString(16).padStart(8, '0') +
                          id.machine.toString(16).padStart(6, '0') +
                          id.pid.toString(16).padStart(4, '0') +
                          id.increment.toString(16).padStart(6, '0');
        return hexString;
      }
    }
    return id ? id.toString() : '';
  }

  exportResponsesToPdf(companyId: string): Observable<Blob> {
    return this.http.get(`${this.responsesApiUrl}/exportResponses/${companyId}`, { responseType: 'blob' });
  }
}
