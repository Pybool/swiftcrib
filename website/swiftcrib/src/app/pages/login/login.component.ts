import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import Swal from 'sweetalert2';
import { SwiftcribFooterComponent } from '../../components/swiftcrib-footer/swiftcrib-footer.component';
import { SwiftcribHeaderComponent } from '../../components/swiftcrib-header/swiftcrib-header.component';

var self: any;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordPattern =
  /^(?=.*[A-Z].*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*[!@#$%^&*])(?=.*[0-9].*[0-9]).{8,}$/;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SwiftcribHeaderComponent,
    SwiftcribFooterComponent
  ],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  activeTab: string = 'signin';
  passwordAgain: string = '';
  accepted = false;
  opacity = 0.5;
  pointerType = 'none';
  showtermsAndConditions = false;
  showLoginSpinner = false;
  showRegSpinner = false;
  isDirtyPassword = false;
  isDirtyEmail = false;
  activeLogin = false;
  credentials: any = {
    email: '',
    password: '',
  };
  loginCredentials: { email: string; password: string } = {
    email: '',
    password: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    self = this;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    document.location.hash = `#${tab}`
  }

  ngAfterViewInit() {
    /* Handle cases where login details are automatically filled by browser*/
    
      const hash = document.location.hash; // Get the current hash fragment
      if (hash === '#signup') {
        this.setActiveTab('signup')
        
      }else{
        this.setActiveTab('signin')
      }
    
  }

  moveBackground(event: MouseEvent): void {
    const amountMovedX = (event.pageX * -1) / 30;
    const amountMovedY = (event.pageY * -1) / 9;
    const backgroundPosition = `${amountMovedX}px ${amountMovedY}px`;

    // Use Angular Renderer to modify DOM properties
    const bgElement = document.querySelector('.container .bg') as HTMLElement;
    bgElement.style.backgroundPosition = backgroundPosition;
  }

  login() {
    this.showLoginSpinner = true;
    this.authService
      .login(this.loginCredentials)
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          if (response.status) {
            this.showLoginSpinner = false;
            this.authService.storeTokens(response);
            this.authService.storeUser(response.data);
            this.authService.setLoggedIn(true);
            setTimeout(()=>{
              this.router.navigate(['/'])
            },1500);
          } else {
            if(response.code == 1001){
              const queryParams = { account_id: response.data };
              this.router.navigate(['account-verification'], {queryParams})
            }
            this.showLoginSpinner = false;
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: `Login Failed`,
              text: response.message,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        },
        (error: any) => {
          this.showLoginSpinner = false;
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Login eror`,
            text: 'Something went wrong',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      );
  }

  register() {
    if (!this.accepted || this.isPasswordMatch() || this.isInvalidEmail(this.credentials)) {
      return null;
    }
    this.showRegSpinner = true;
    if (
      this.passwordAgain == this.credentials.password &&
      this.passwordAgain.length >= 8
    ) {
      this.authService
        .register(this.credentials)
        .pipe(take(1))
        .subscribe(
          (response: any) => {
            this.showRegSpinner = false;
            if (response?.status) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `Login Success!`,
                text: response.message,
                showConfirmButton: false,
                timer: 1500,
              });

              setTimeout(() => {
                const queryParams = { account_id: response.data };
                localStorage.setItem(response.data, this.credentials.email);
                self.router.navigate(['/account-verification'], {
                  queryParams,
                });
              }, 2000);
            } else {
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: `Registration failed!`,
                text: response.message,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          },
          (error: any) => {
            this.showRegSpinner = false;
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: `Registration Failed`,
              text: 'Something went wrong',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        );
    } else {
      this.showRegSpinner = false;
      alert('Invalid password/ Non matching password');
    }
    return null;
  }

  toggleTermsAndConditions() {
    this.showtermsAndConditions = !this.showtermsAndConditions;
  }

  toggleAccepted() {
    this.accepted = !this.accepted;
    if (this.accepted && !this.isPasswordMatch() && !this.isInvalidEmail(this.credentials)) {
      this.opacity = 1;
      this.pointerType = 'auto';
      return;
    }
    this.opacity = 0.5;
    this.pointerType = 'none';
  }

  requirederrors(field: string) {
    try {
      if (this.credentials[field].length == 0) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  isInvalidEmail(credentials:any) {
    try {
      if (credentials.email.trim().length > 0) {
        if (!emailRegex.test(credentials.email)) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  isInvalidPassword() {
    try {
      if (this.credentials.password.trim().length > 0) {
        if (!passwordPattern.test(this.credentials.password)) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  enableLoginButton(){
    this.activeLogin = this.loginCredentials.password.trim() != "" && !this.isInvalidEmail(this.loginCredentials);
  }

  isPasswordMatch() {
    if (this.passwordAgain.trim() == '' && this.isDirtyPassword) {
      return true;
    }
    try {
      if (this.passwordAgain != this.credentials.password) {
        this.accepted = false;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  dirtyEmail(credentials:any) {
    if (!this.isDirtyEmail) this.isDirtyEmail = true;
    if (this.accepted && !this.isPasswordMatch() && !this.isInvalidEmail(credentials)) {
      this.opacity = 1;
      this.pointerType = 'pointer';
      return;
    }
    this.opacity = 0.5;
    this.pointerType = 'none';
    //
    this.enableLoginButton()
  }

  dirtyPassword() {
    if (!this.isDirtyPassword) this.isDirtyPassword = true;
    if (this.accepted && !this.isPasswordMatch() && !this.isInvalidEmail(this.credentials)) {
      this.opacity = 1;
      this.pointerType = 'pointer';
      return;
    }
    this.opacity = 0.5;
    this.pointerType = 'none';
  }
}

