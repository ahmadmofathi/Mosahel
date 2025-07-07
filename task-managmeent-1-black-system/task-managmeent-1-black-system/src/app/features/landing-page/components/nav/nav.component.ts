import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgFor],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  email: string = 'Info@alwethq.com.sa';
  phone: string = '+966500612332';
  links: any[] = [
    { icon: 'fab fa-whatsapp', link: 'https://wa.me/+966500612332' },
    { icon: 'fab fa-youtube', link: '' },
    {
      icon: 'fab fa-instagram',
      link: 'https://www.instagram.com/alwethq4?igsh=MWFxcDA2YmxxZnNrYQ%3D%3D&utm_source=qr',
    },
    { icon: 'fab fa-snapchat', link: '' },
    { icon: 'fab fa-tiktok', link: '' },
    {
      icon: 'fab fa-x-twitter',
      link: 'https://x.com/alwethq?s=21&t=2sUzEGdBGoC5jEBFMNjDaw',
    },
    { icon: 'fab fa-facebook', link: '' },
    {
      icon: 'fab fa-linkedin',
      link: 'http://www.linkedin.com/in/شركة-الوثق-لخدمات-الأعمال-8b8245337',
    },
  ];

  logo: string = '/images/logo.png';
  navItems: any[] = [
    { label: 'الرئيسية', link: '/' },
    { label: 'من نحن', link: '/about' },
    { label: 'خدماتنا', link: '#services' },
    { label: 'توظيف', link: '/' },
    { label: 'تواصل معنا', link: '/' },
  ];
  callToAction: string = 'اطلب الخدمة';
}
