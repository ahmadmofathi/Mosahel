import { Routes } from '@angular/router';
import { ValiditiesListComponent } from './components/validities-list/validities-list.component';

export const VALIDITIES_ROUTES: Routes = [
  {
    path: '',
    component: ValiditiesListComponent,
    data: { title: 'الصلاحيات' },
  },
];
