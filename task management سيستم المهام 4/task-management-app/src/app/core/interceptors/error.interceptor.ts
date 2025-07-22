import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorService } from '../services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'حدث خطأ غير متوقع';

      if (error.error instanceof ErrorEvent) {
        // خطأ من جهة العميل
        errorMessage = error.error.message;
      } else {
        // خطأ من جهة الخادم
        switch (error.status) {
          case 400:
            console.log(error.status);
            errorMessage = handleValidationError(error.error);
            break;
          case 401:
            // authService.logout();
            router.navigate(['/auth/login']);
            errorMessage = handleValidationError(error.error);
            break;
          case 403:
            errorMessage = 'ليس لديك إذن للقيام بهذا الإجراء';
            break;
          case 404:
            errorMessage = 'المورد غير موجود';
            break;
          case 422:
            errorMessage = handleValidationError(error.error);
            break;
          case 500:
            errorMessage = 'خطأ في الخادم. يرجى المحاولة لاحقًا';
            break;
          default:
            errorMessage = `خطأ: ${error.message}`;
        }
      }

      errorService.showError(errorMessage);
      return throwError(() => error);
    })
  );
};

function handleValidationError(error: any): string {
  console.log(error);
  if (error.errors) {
    const errors = Object.entries(error.errors)
      .map(
        ([field, messages]: [string, any]) =>
          `${field}: ${
            Array.isArray(messages) ? messages.join(', ') : messages
          }`
      )
      .join('\n');
    return `خطأ في التحقق:\n${errors}`;
  }
  return error.message || 'فشل التحقق';
}
