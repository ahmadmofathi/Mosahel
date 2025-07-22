import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { title: 'تقرير شامل' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/report/report.component').then(
            (m) => m.ReportComponent
          ),
      },
    ],
  },
];
