import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if ([401, 403].includes(error.status)) {
        // Auto logout if 401 or 403 response returned from api
        authService.logout();
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url }
        });
      }

      const errorMessage = error.error?.message || error.statusText;
      return throwError(() => errorMessage);
    })
  );
};