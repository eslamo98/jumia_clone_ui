// src/app/auth/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
        };
      };
    };
    FB: {
      login: (callback: (response: FacebookLoginResponse) => void, options: FacebookLoginOptions) => void;
      api: (path: string, params: object, callback: (response: FacebookUserData) => void) => void;
    };
  }
}

interface FacebookLoginResponse {
  authResponse?: {
    accessToken: string;
    userID: string;
  };
  status?: string;
}

interface FacebookLoginOptions {
  scope: string;
}

interface FacebookUserData {
  email: string;
  name: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated() && !this.authService.isTokenExpired()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login({
      email: this.f['email'].value,
      password: this.f['password'].value
    })
    .pipe(first())
    .subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: error => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  handleGoogleLogin(): void {
    // Initialize Google Sign-In
    window.google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleGoogleCallback.bind(this)
    });
    window.google.accounts.id.prompt();
  }

  handleFacebookLogin(): void {
    window.FB.login((response: FacebookLoginResponse) => {
      if (response.authResponse?.accessToken) {
        window.FB.api('/me', { fields: 'email,name,picture' }, (userData: FacebookUserData) => {
          if (!userData || !userData.email) {
            this.error = 'Failed to get user data from Facebook';
            this.loading = false;
            return;
          }

          // Split the name into first and last name
          const nameParts = userData.name.split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

          this.authService.externalAuth('FACEBOOK', response.authResponse!.accessToken, {
            email: userData.email,
            name: userData.name,
            firstName: firstName,
            lastName: lastName,
            photoUrl: userData.picture?.data?.url,
            userType: 'Customer'  // Add user type for registration
          }, false)
          .pipe(first())
          .subscribe({
            next: () => {
              this.router.navigate(['/']);
            },
            error: error => {
              console.error('External auth error:', error);
              this.error = 'Registration failed. Please try again.';
              this.loading = false;
            }
          });
        });
      } else {
        this.error = 'Facebook login failed. Please try again.';
        this.loading = false;
      }
    }, { scope: 'email,public_profile' });
  }

  private handleGoogleCallback(response: any): void {
    const payload = this.decodeJwtResponse(response.credential);
    
    // Split the name into first and last name
    const nameParts = payload.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    this.authService.externalAuth('GOOGLE', response.credential, {
      email: payload.email,
      name: payload.name,
      firstName: firstName,
      lastName: lastName,
      photoUrl: payload.picture,
      userType: 'Customer'  // Add user type for registration
    }, true)
    .pipe(first())
    .subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: error => {
        console.error('External auth error:', error);
        this.error = 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }


  private decodeJwtResponse(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  }
}