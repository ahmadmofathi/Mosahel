import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { title: 'الموظفين' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/employee-list/employee-list.component').then(
            (m) => m.EmployeeListComponent
          ),
      },
    ],
  },
];
