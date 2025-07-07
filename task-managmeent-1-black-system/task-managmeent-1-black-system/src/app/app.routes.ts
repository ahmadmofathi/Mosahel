import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/landing-page/landing-page.routes').then(
        (m) => m.LANDING_PAGE_ROUTES
      ),
    canActivate: [noAuthGuard],
  },
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
    path: 'crm',
    loadChildren: () =>
      import('./features/crm/crm.routes').then((m) => m.CRM_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'deals',
    loadChildren: () =>
      import('./features/deals/deals.routes').then((m) => m.DEALS_ROUTE),
    canActivate: [authGuard],
  },
  {
    path: 'bills',
    loadChildren: () =>
      import('./features/bills/bills.routes').then((m) => m.BILLS_ROUTES),
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
    path: 'new-password',
    loadChildren: () =>
      import('./features/new-password/newPassword.routes').then(
        (m) => m.NEWPASSWORD_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'system-settings',
    loadChildren: () =>
      import('./features/system-settings/systemSettings.routes').then(
        (m) => m.systemSettings_routes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'support',
    loadChildren: () =>
      import('./features/support/support.routes').then((m) => m.SUPPORT_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'validities',
    loadChildren: () =>
      import('./features/validities/validities.routes').then(
        (m) => m.VALIDITIES_ROUTES
      ),
    canActivate: [authGuard],
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
