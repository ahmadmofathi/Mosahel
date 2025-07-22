import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const ATTEND_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { title: 'الحضور والانصراف' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/attendance-list/attendance-list.component').then(
            (m) => m.AttendanceListComponent
          ),
      },
    ],
  },
];
