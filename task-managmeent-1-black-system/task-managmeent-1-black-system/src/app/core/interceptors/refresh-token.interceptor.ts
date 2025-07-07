import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export const refreshTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('refresh')) {
        let currentUser = localStorage.getItem('currentUser');
        const current = currentUser ? JSON.parse(currentUser) : null;

        if (current) {
          const tokens = {
            refreshToken: current.refreshToken,
            token: current.token,
          };
          return authService.refreshToken(tokens).pipe(
            switchMap((response: any) => {
              console.log(response);
              // Save the new access token
              let tempUser = { ...current, token: response.token };
              localStorage.setItem('currentUser', JSON.stringify(tempUser));

              // Retry the original request with the new token
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.token}`,
                },
              });

              return next(clonedReq);
            }),
            catchError((refreshError) => {
              // Handle refresh token error
              console.error('Refresh token error', refreshError);
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
