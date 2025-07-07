import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-customer-service',
  templateUrl: './customer-service.component.html',
  styleUrl: './customer-service.component.css',
  animations: [
    trigger('toggleAnswer', [
      state('void', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden'
      })),
      state('*', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      transition('void <=> *', [
        animate('100ms ease-in-out')
      ])
    ])
  ]
})
export class CustomerServiceComponent {
  faqItems = [
    { question: "هذا النص يمكن تغييره عند البرمجة", answer: "هذا النص يمكن تغييره عند البرمجة هذا النص يمكن تغييره عند البرمجة.", open: false },
    { question: "ماذا نقدم؟", answer: "نقدم مجموعة من الدورات التعليمية.", open: false },
    { question: "هل الدورات مجانية؟", answer: "نعم، يمكنك الوصول إلى الكثير من المحتوى مجانًا.", open: false },
    { question: "هل الدورات مجانية؟", answer: "نعم، يمكنك الوصول إلى الكثير من المحتوى مجانًا.", open: false },
    { question: "هل الدورات مجانية؟", answer: "نعم، يمكنك الوصول إلى الكثير من المحتوى مجانًا.", open: false }
  ];
  items = [
    {
      image: 'assets/hero.png',
      videos: '2K+',
      courses: '5K+',
      tutors: '250+',
      title: 'منصة المسار الصحيح للدورات التدريبية',
      description: 'انطلق بثقة نحو مستقبلك المهني، فنحن نوفّر لك المعرفة والمهارات التي تصنع الفارق الحقيقي في مسارك الوظيفي. عبر دورات متخصصة ومدربين معتمدين، نأخذ بيدك نحو التميز والاحتراف',
      primaryButton: 'تصفح الكورسات الموجودة',
      secondaryButton: 'اشترك الآن',
    },
    // {
    //   image: 'assets/hero.png',
    //   videos: '3K+',
    //   courses: '6K+',
    //   tutors: '300+',
    //   title: 'منصة ثانية',
    //   description: `نص مختلف يمكن تغييره عند البرمجة
    //                 نص جديد لعرض البيانات المحدثة في الكاروسيل.`,
    //   primaryButton: 'ابدأ التعلم الآن',
    //   secondaryButton: 'سجل اليوم',
    // }
  ];

  videoCourses = 2000;
  onlineCourses = 500;
  tutors = 250;

  name = '';
  email = '';
  message = '';

  toggleAnswer(item: any) {
    item.open = !item.open;
  }

  submitForm() {
    // Handle form submission
    console.log("Form Submitted", { name: this.name, email: this.email, message: this.message });
  }
}
