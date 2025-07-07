import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { SystemSettingsComponent } from './components/system-settings/system-settings.component';

export const systemSettings_routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { title: 'الاعدادات' },
    component: SystemSettingsComponent,
  },
];
