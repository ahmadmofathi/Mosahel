import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const SERVICE_REQUEST_ROUTES: Routes = [
{
    path: '',
    canActivate: [authGuard],
    data: { title: 'طلب خدمة' },
    children: [
    {
        path: '',
        loadComponent: () =>
        import('./components/service-request-list/service-request-list.component').then(
            (m) => m.ServiceRequestListComponent
        ),
    },
    ],
},
];
