import { Routes } from '@angular/router';
import { DealsListComponent } from './components/deals-list/deals-list.component';

export const DEALS_ROUTE: Routes = [
  {
    path: '',
    component: DealsListComponent,
    data: { title: 'العقود' },
  },
];
