import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const NEWPASSWORD_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { title: 'الحضور والانصراف' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/new-pass/new-pass.component').then(
            (m) => m.NewPassComponent
          ),
      },
    ],
  },
];
