import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const NOTIFICATION_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { title: 'التعميم' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './components/notification-list/notification-list.component'
          ).then((m) => m.NotificationListComponent),
      },
    ],
  },
];
