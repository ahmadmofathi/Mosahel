import { Routes } from '@angular/router';
import { BillsListComponent } from './bills-list/bills-list.component';

export const BILLS_ROUTES: Routes = [
  {
    path: '',
    component: BillsListComponent,
    data: { title: 'الفواتير' },
  },
];
