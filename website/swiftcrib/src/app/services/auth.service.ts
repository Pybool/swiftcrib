import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  tokenKey: string = 'swiftcrib-accessToken';
  userKey: string = 'swiftcrib-user';
  loggedIn: boolean = false;
  loggedIn$: any = new BehaviorSubject(false);
  vendorSubscription: boolean = false;
  vendorSubscription$: any = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  setLoggedIn(status: boolean) {
    this.loggedIn = status;
    this.loggedIn$.next(this.loggedIn);
  }

  getAuthStatus() {
    return this.loggedIn$.asObservable();
  }

  login(credentials: any) {
    return this.http.post(`${environment.api}/api/v1/auth/login`, credentials);
  }

  register(user: any) {
    return this.http.post(`${environment.api}/api/v1/auth/register`, user);
  }

  sendPasswordResetOtp(email: any) {
    return this.http.post(
      `${environment.api}/api/v1/auth/send-password-reset-otp`,
      { email }
    );
  }

  resetPassword(payload: any) {
    return this.http.post(
      `${environment.api}/api/v1/auth/reset-password`,
      payload
    );
  }

  resendOtp(user: any) {
    return this.http.post(
      `${environment.api}/api/v1/auth/resend-email-verification-otp`,
      user
    );
  }

  verifyAccount(payload: { email: string; otp: string | number }) {
    return this.http.put(
      `${environment.api}/api/v1/auth/verify-account`,
      payload
    );
  }

  updateProfile(user: any) {
    return this.http.put(`${environment.api}/api/v1/auth/user-profile`, user);
  }

  retrieveToken(tokenKey: string) {
    if (
      this.cookieService.get(tokenKey) &&
      this.cookieService.get(tokenKey) != ''
    ) {
      return this.cookieService.get(tokenKey);
    } else {
      return window.localStorage.getItem(tokenKey);
    }
  }

  refresh() {
    const refreshToken = this.retrieveToken('swiftcrib-refreshToken');
    return this.http.post(`${environment.api}/api/v1/auth/refresh-token`, {
      refreshToken,
    });
  }

  storeTokens(loginResponse: any, storeRefresh = true) {
    this.cookieService.set('swiftcrib-accessToken', loginResponse.accessToken);
    if (storeRefresh) {
      this.cookieService.set(
        'swiftcrib-refreshToken',
        loginResponse.refreshToken
      );
      //Backup
      window.localStorage.setItem(
        'swiftcrib-refreshToken',
        loginResponse.refreshToken
      );
    }
    //Backup
    window.localStorage.setItem(
      'swiftcrib-accessToken',
      loginResponse.accessToken
    );
  }

  logout() {
    this.removeUser();
    this.setLoggedIn(false);
    this.cookieService.delete('swiftcrib-accessToken');
    this.cookieService.delete('swiftcrib-refreshToken');
    window.localStorage.removeItem('swiftcrib-accessToken');
    window.localStorage.removeItem('swiftcrib-refreshToken');
    return this.router.navigateByUrl('/authentication');
  }

  uploadAvatar(formData: any) {
    return this.http.post(
      `${environment.api}/api/v1/accounts/upload-avatar`,
      formData
    ).pipe(
      tap((res:any) => {
        if(res.status){
          this.storeUser(res?.data)
        }
      }),
      catchError((error) => {
        console.error('Avatar update failed', error);
        throw error;
      })
    );
  }

  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  storeUser(user: any) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  retrieveUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  removeUser() {
    localStorage.removeItem(this.userKey);
  }

  navigateToUrl(url: string) {
    this.router.navigateByUrl(url);
  }
}
