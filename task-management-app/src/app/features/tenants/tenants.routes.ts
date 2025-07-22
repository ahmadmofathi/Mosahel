import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const TENANTS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { title: 'اداره الشركات' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/tenants-list/tenants-list.component').then(
            (m) => m.TenantsListComponent
          ),
      },
    ],
  },
];
