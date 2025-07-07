import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const noAuthGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated().pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        // If user is authenticated, redirect to dashboard
        const currentRole = localStorage.getItem('role') ?? '';
        switch (currentRole) {
          case 'HRSpecialist':
            router.navigateByUrl('/employee');
            break;
          case 'SalesSpecialist':
            router.navigateByUrl('/crm');
            break;
          default:
            router.navigateByUrl('/dashboard');
            break;
        }
        return false;
      }
      return true;
    })
  );
};
