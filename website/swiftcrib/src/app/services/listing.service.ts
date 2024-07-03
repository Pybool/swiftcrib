import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
const defaultTimeOut = 15000;
interface Ifilters {
  searchText?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  beds?: number | string;
  baths?: number | string;
  serviceType?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  constructor(private http: HttpClient) {}

  fetchProximityListings(): Observable<any> {
    const requestUrl = `${environment.api}/api/v1/listing/fetch-proximity-listings`;
    return this.http.get(requestUrl).pipe(
      timeout(defaultTimeOut),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ProgressEvent) {
          console.error('Request timed out after 15 seconds.');
          return of(null);
        } else {
          console.error('An error occurred:', error);
          return throwError(error);
        }
      })
    );
  }

  fetchOtherListings(page:number , limit:number): Observable<any> {
    const requestUrl = `${environment.api}/api/v1/listing/fetch-listings?page=${page}&limit=${limit}`;
    return this.http.get(requestUrl).pipe(
      timeout(defaultTimeOut),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ProgressEvent) {
          console.error('Request timed out after 15 seconds.');
          return of(null);
        } else {
          console.error('An error occurred:', error);
          return throwError(error);
        }
      })
    );
  }

  bookMarkListing(listingId:string): Observable<any> {
    const requestUrl = `${environment.api}/api/v1/listing/bookmark-listing`;
    return this.http.post(requestUrl, {listing: listingId}).pipe(
      timeout(defaultTimeOut),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ProgressEvent) {
          console.error('Request timed out after 15 seconds.');
          return of(null);
        } else {
          console.error('An error occurred:', error);
          return throwError(error);
        }
      })
    );
  }

  fetchBookMarks(page:number , limit:number): Observable<any> {
    const requestUrl = `${environment.api}/api/v1/listing/fetch-bookmarks?page=${page}&limit=${limit}`;
    return this.http.get(requestUrl).pipe(
      timeout(defaultTimeOut),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ProgressEvent) {
          console.error('Request timed out after 15 seconds.');
          return of(null);
        } else {
          console.error('An error occurred:', error);
          return throwError(error);
        }
      })
    );
  }

  searchListings(page:number , limit:number, filter: Ifilters, loc:string): Observable<any> {
    const requestUrl = `${environment.api}/api/v1/listing/search-listings?searchText=${filter.searchText}&minPrice=${filter.minPrice}&maxPrice=${filter.maxPrice}&beds=${filter.beds}&baths=${filter.baths}&serviceType=${filter.serviceType}&loc=${loc || 'ibadan'}&page=${page}&limit=${limit}`;
    return this.http.get(requestUrl).pipe(
      timeout(defaultTimeOut),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ProgressEvent) {
          console.error('Request timed out after 15 seconds.');
          return of(null);
        } else {
          console.error('An error occurred:', error);
          return throwError(error);
        }
      })
    );
  }

}