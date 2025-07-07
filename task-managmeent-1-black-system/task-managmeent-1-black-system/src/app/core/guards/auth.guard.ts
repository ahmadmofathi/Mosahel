import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated().pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      } else {
        // Store the attempted URL for redirecting after login
        const currentUrl = router.routerState.snapshot.url;
        localStorage.setItem('returnUrl', currentUrl);

        router.navigate(['/auth/login']);
        return false;
      }
    })
  );
};
