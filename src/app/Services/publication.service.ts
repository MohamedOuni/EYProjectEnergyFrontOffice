import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  private apiUrl = 'http://localhost:5022/api/Publication'; 
  private apiUrl2 = 'http://localhost:5022/api/Review'; 

  constructor(private http: HttpClient) { }

  getPublications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getFileUrl(fileId: string): string {
    return `${this.apiUrl}/files/${fileId}`;
  }

  getReviewsByPublicationId(publicationId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl2}/${publicationId}/review`);
  }

addReview(publicationId: string, review: any): Observable<any> {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.post(`${this.apiUrl2}/${publicationId}/reviews`, review, { withCredentials: true, headers });
}

}