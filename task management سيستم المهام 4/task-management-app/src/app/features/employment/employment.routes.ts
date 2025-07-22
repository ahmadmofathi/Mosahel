import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const EMPLOYMENT_ROUTES: Routes = [
{
    path: '',
    canActivate: [authGuard],
    data: { title: 'التوظيف' },
    children: [
    {
        path: '',
        loadComponent: () =>
        import('./components/employment-list/employment-list.component').then(
            (m) => m.EmploymentListComponent
        ),
    },
    ],
},
];
