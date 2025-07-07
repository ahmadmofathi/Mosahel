import { CommonModule, NgFor } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent implements AfterViewInit {
  header: string = 'آراء العملاء';
  customers = [
    {
      name: 'مي علي خالد',
      image: '/images/fperson.png',
      review:
        'ألف شكر شركة الوثق، أخذنا فترة طويلة نواجه بعض المشاكل، وبفضل الله ثم أنتم تم حل هذه المشاكل.',
    },
    {
      name: 'أحمد عبد الله',
      image: '/images/person.png',
      review: 'خدمة ممتازة ودعم فني رائع! سعيد جدًا بالتعامل معكم.',
    },
    {
      name: 'فاطمة الزهراء',
      image: '/images/fperson.png',
      review:
        'الشركة تقدم خدمات على مستوى عالٍ من الاحترافية. أنصح الجميع بالتعامل معهم.',
    },
    {
      name: 'نورة حسن',
      image: '/images/fperson.png',
      review: 'تعامل احترافي وخدمة مميزة، شكراً لكم.',
    },
  ];

  ngAfterViewInit() {
    new Swiper('.swiper-container', {
      modules: [Navigation, Pagination, Autoplay],
      loop: true,
      slidesPerView: 3,
      spaceBetween: 30,
      autoplay: {
        delay: 3000, // تشغيل تلقائي كل 3 ثواني
        disableOnInteraction: false, // لا يتوقف عند التفاعل مع السلايدر
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }
}
