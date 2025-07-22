import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const TRAIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { title: 'التدريب' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/train-list/train-list.component').then(
            (m) => m.TrainListComponent
          ),
      },
    ],
  },
];
