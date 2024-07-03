import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
const defaultTimeOut = 30000;

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  constructor(private http: HttpClient) {}

  submitAgentInformation(payload: any): Observable<any> {
    
    const requestUrl = `${environment.api}/api/v1/portal/create-agent`;
    return this.http.post(requestUrl, payload).pipe(
      timeout(defaultTimeOut),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ProgressEvent) {
          console.error('Request timed out after 30 seconds.');
          return of(null);
        } else {
          console.error('An error occurred:', error.error);
          return throwError(error);
        }
      })
    );
  }

}