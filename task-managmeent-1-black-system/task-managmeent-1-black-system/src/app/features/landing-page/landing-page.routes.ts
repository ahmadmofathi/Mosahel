import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

export const LANDING_PAGE_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'الوثق' },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { title: 'من نحن' },
  },
];
