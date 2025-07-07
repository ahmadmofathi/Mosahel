import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';

const currentRole = localStorage.getItem('role') ?? '';
export const SUPPORT_ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    data: { title: 'الدعم الفني' },
  },
];
