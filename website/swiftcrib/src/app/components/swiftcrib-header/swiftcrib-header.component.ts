import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-swiftcrib-header',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [AuthService, TokenService],
  templateUrl: './swiftcrib-header.component.html',
  styleUrl: './swiftcrib-header.component.scss',
})
export class SwiftcribHeaderComponent {
  public user: any;
  public avatar = '';
  public serverUrl = environment.api;
  public defaultLocation = 'ibadan'
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.retrieveUser();
    if (this.user) {
      this.avatar = this.user?.avatar;
      this.authService.setLoggedIn(true);
    } else {
      this.authService.setLoggedIn(false);
    }
  }

  shortenEmail(email: string) {
    try {
      const [localPart, domain] = email.split('@');
      if (localPart.length > 4) {
        const shortenedLocalPart = localPart.slice(0, 4) + '...';
        return `${shortenedLocalPart}@${domain}`;
      } else {
        return email;
      }
    } catch (error) {
      return 'Invalid email address';
    }
  }

  changeAvatar($event: any) {
    const imgInput = document.querySelector(
      '.avatar-input'
    ) as HTMLInputElement;
    imgInput?.click();
  }

  onAvatarChange($event: any) {
    const file = $event?.target?.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('attachments', file);

      // this.uploadAvatar(formData).pipe(take(1)).subscribe(
      //   (response: any) => {
      //     console.log('Upload successful', response);
      //     this.avatar = response.data.avatar;
      //   },
      //   (error: any) => {
      //     console.error('Upload failed', error);
      //   }
      // );
    }
  }

  uploadAvatar(formData: FormData) {
    return this.authService.uploadAvatar(formData);
  }

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }

  logout() {
    //  this.tokenService.removeTokens();
    this.authService.logout();
  }
}
