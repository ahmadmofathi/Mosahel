import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgFor],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  constructor(private sanitizer: DomSanitizer) {}

  title: string = 'معلومات التواصل';
  logo: string = '/images/logo.png';
  border: string = '/images/border.png';
  description: string =
    'نقدم حلولاً استشارية متكاملة تجمع بين أفضل الممارسات العالمية وفهم عميق للسوق المحلي، مع التركيز على الابتكار والتحول الرقمي والاستدامة.';
  socialIcons: any[] = [
    { icon: 'fab fa-youtube', link: '' },
    {
      icon: 'fab fa-instagram',
      link: 'https://www.instagram.com/alwethq4?igsh=MWFxcDA2YmxxZnNrYQ%3D%3D&utm_source=qr',
    },
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

  links: any = {
    title: 'روابط',
    items: [
      { label: 'الرئيسية', link: '/' },
      { label: 'خدماتنا', link: '#services' },
      { label: 'من نحن', link: '/about' },
      { label: 'تواصل معنا', link: '/' },
    ],
  };

  getContact: any = {
    title: 'للتواصل معانا',
    items: [
      {
        icon: 'fas fa-location',
        link: 'https://maps.google.com/?q=24.6445579528809,46.7334022521973',
        text: 'طريق الخرج الفرعي حي ثليم شارع عمر بن الخطاب',
      },
      {
        icon: 'fas fa-envelope',
        link: 'mailto:Info@alwethq.com.sa',
        text: 'Info@alwethq.com.sa',
      },
      {
        icon: 'fas fa-phone',
        link: 'http://wa.me/+966500612332',
        text: '+966500612332',
      },
    ],
  };

  location: any = {
    title: 'موقعنا الجغرافي الحالي',
    src: this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps?q=24.6445579528809,46.7334022521973&z=14&output=embed'
    ),
  };

  copyRight: string = '@جميع الحقوق محفوظة لشركة © الوثق';
}
