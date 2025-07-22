import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const PROFILES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { title: 'الصفحه الشخصيه' },
    children: [
      {
        path: 'employee',
        loadComponent: () =>
          import('./components/employee-profile/employee-profile.component').then(
            (m) => m.EmployeeProfileComponent
          ),
      },
      {
        path: 'tenant',
        loadComponent: () =>
          import('./components/tenant-profile/tenant-profile.component').then(
            (m) => m.TenantProfileComponent
          ),
      },
    ],
  },
];
