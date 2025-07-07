import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { HasRoleDirective } from '../../../core/directives/has-role.directive';

interface MenuItem {
  label: string;
  icon: string;
  visible?: boolean;
  route: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatExpansionModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  currentRole = localStorage.getItem('role') ?? '';
  menuItems: MenuItem[] = [
    {
      label: 'الرئيسية',
      icon: 'fas fa-home',
      route: '/dashboard',
      visible: [
        'Admin',
        'SuperAdmin',
        'OperationsManager',
        'Employee',
      ].includes(this.currentRole),
    },
    {
      label: 'إدارة المهام',
      icon: 'fas fa-tasks',
      route: '/tasks',
      visible: [
        'Admin',
        'SuperAdmin',
        'HRSpecialist',
        'Employee',
        'OperationsManager',
      ].includes(this.currentRole),
    },
    {
      label: 'إدارة الموظفين',
      icon: 'fas fa-users',
      route: '/employee',
      visible: [
        'Admin',
        'SuperAdmin',
        'HRSpecialist',
        'OperationsManager',
      ].includes(this.currentRole),
    },
    {
      label: 'CRM',
      icon: 'fa fa-bars',
      route: '/crm',
      visible: ['SalesSpecialist', 'SuperAdmin', 'OperationsManager'].includes(
        this.currentRole
      ),
    },
    {
      label: 'فتح العقد',
      icon: 'fas fa-chart-bar',
      route: '/deals',
      visible: ['SalesSpecialist', 'SuperAdmin', 'OperationsManager'].includes(
        this.currentRole
      ),
    },
    {
      label: 'الفواتير',
      icon: 'fas fa-chart-bar',
      route: '/bills',
      visible: ['SalesSpecialist', 'SuperAdmin', 'OperationsManager'].includes(
        this.currentRole
      ),
    },
    {
      label: 'التدريب',
      icon: 'fas fa-file-contract',
      route: '/train',
      visible: [
        'Admin',
        'SuperAdmin',
        'HRSpecialist',
        'Employee',
        'OperationsManager',
      ].includes(this.currentRole),
    },
    {
      label: 'الملفات',
      icon: 'fas fa-file-invoice',
      route: '/files',
      visible: ['Admin', 'Employee', 'OperationsManager'].includes(
        this.currentRole
      ),
    },
    {
      label: 'التعميم',
      icon: 'fas fa-chart-bar',
      route: '/notification',
      visible: [
        'Admin',
        'SuperAdmin',
        'HRSpecialist',
        'OperationsManager',
      ].includes(this.currentRole),
    },
    {
      label: 'الحضور والانصراف',
      icon: 'fas fa-chart-bar',
      route: '/attendance',
      visible: [
        'Admin',
        'SuperAdmin',
        'HRSpecialist',
        'Employee',
        'OperationsManager',
      ].includes(this.currentRole),
    },
    {
      label: 'اعداد كلمة السر',
      icon: 'fas fa-chart-bar',
      route: '/new-password',
      visible: this.currentRole === 'Employee',
    },
  ];

  settingsItems: MenuItem[] = [
    {
      label: 'إدارة مستخدمي النظام',
      icon: 'fas fa-user',
      route: '/validities',
      visible: ['OperationsManager', 'SuperAdmin'].includes(this.currentRole),
    },
    {
      label: 'اعدادات النظام',
      icon: 'fas fa-tools',
      route: '/system-settings',
      visible: ['SuperAdmin', 'OperationsManager'].includes(this.currentRole),
    },
    {
      label: 'إدارة الشركات',
      icon: 'fas fa-chart-line',
      route: '/tenants',
      visible: ['SuperAdmin', 'OperationsManager'].includes(this.currentRole),
    },
    {
      label: 'الدعم افني',
      icon: 'fas fa-headset',
      route: '/support',
      visible: true,
    },
  ];
}
