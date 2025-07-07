import { Routes } from '@angular/router';
import { CrmListComponent } from './components/crm-list/crm-list.component';
import { CrmFormComponent } from './components/crm-form/crm-form.component';

export const CRM_ROUTES: Routes = [
  {
    path: '',
    component: CrmListComponent,
    data: { title: 'CRM' },
  },
  {
    path: 'new',
    component: CrmFormComponent,
    data: { title: 'CRM' },
  },
  {
    path: 'edit/:id',
    component: CrmFormComponent,
    data: { title: 'CRM' },
  },
];
