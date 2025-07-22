import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    canActivate: [noAuthGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./features/tasks/tasks.routes').then((m) => m.TASKS_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'attendance',
    loadChildren: () =>
      import('./features/attendance/attendance.routes').then(
        (m) => m.ATTEND_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'employee',
    loadChildren: () =>
      import('./features/employee/employee.routes').then(
        (m) => m.EMPLOYEE_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path:'profile',
    loadChildren: () =>
      import('./features/profiles/profiles.routes').then(
        (m) => m.PROFILES_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'tenants',
    loadChildren: () =>
      import('./features/tenants/tenants.routes').then((m) => m.TENANTS_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'notification',
    loadChildren: () =>
      import('./features/notification/notification.routes').then(
        (m) => m.NOTIFICATION_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'train',
    loadChildren: () =>
      import('./features/train/train.routes').then((m) => m.TRAIN_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'files',
    loadChildren: () =>
      import('./features/files/files.routes').then((m) => m.FILES_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./features/reports/reports.routes').then((m) => m.REPORTS_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'new-password',
    loadChildren: () =>
      import('./features/new-password/newPassword.routes').then(
        (m) => m.NEWPASSWORD_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/ui/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    title: '404 - Not Found',
  },
];
