import { Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { TooltipOptions } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit{
  @ViewChild('statsSection') statsSection!: ElementRef<HTMLElement>;

  product1 = {
    name: 'دورة تطور المهني المستمر',
    description: 'هذا النص يمكن تغييره في اي وقت هذا النص يمكن تغييره في اي وقت علي حسب طلبك',
    goals: [
      'هذا النص يمكن تغييره في اي وقت هذا النص يمكن ',
      'هذا النص يمكن تغييره في اي وقت هذا النص يمكن ',
      'هذا النص يمكن تغييره في اي وقت هذا النص يمكن ',
      'هذا النص يمكن تغييره في اي وقت هذا النص يمكن ',
      'هذا النص يمكن تغييره في اي وقت هذا النص يمكن ',
    ],
    totalLearners: 2120,
    id: 99
  };
  products: any[] = [
    {
      id: '1001',
      name: 'مدقق داخلي لأنظمة إدارة الجودة ISO 9001-2015',
      description: '',
      image: 'https://cdn.salla.sa/qQzmBW/a7fd1ba3-6145-403c-ba47-5882a9486d25-1000x1000-JUq31EddUwbr7UMVJVZOvZVcQ0Wo8SsEKrbe65KZ.jpg',
      price: 17.78,
      avgRating: 4.7,
      totalRatings: 5,
      status: 'اون لاين',
      students: 2387, 
      learningPoints: [
        'تعلم أحدث مهارات التطور المهني',
        'اكتساب مهارات متقدمة في القيادة',
        'تعلم كيفية بناء خطط تطوير شخصية',
        'تحليل أداء العمل وتحسينه'
      ]
    },
    {
      id: '1002',
      name: 'دورة الصحة والسلامة المهنية IOSH',
      description: '',
      image: 'https://cdn.salla.sa/qQzmBW/583f7efe-dbed-4376-887d-1dde1ad633fd-1000x1000-g2wdFRPfjkWdKQVPjapE8siThCx22nbMOnZFlYcp.jpg',
      price: 22.50,
      avgRating: 4.8,
      totalRatings: 8,
      status: 'اون لاين',
      students: 3200, 
      learningPoints: [
        'التخطيط الفعّال وإدارة المشاريع',
        'تقنيات إدارة المخاطر',
        'كيفية تنظيم فرق العمل',
        'تحليل مؤشرات نجاح المشاريع'
      ]
    },
    {
      id: '1003',
      name: 'محاسب رواتب في الموارد البشرية',
      description: '',
      image: 'https://cdn.salla.sa/qQzmBW/dd34b824-fd7e-4b61-926b-8b2190dc32f4-1000x1000-uotDQ4Js4iYc4NKiMlTTEk1v0hGMvtXJ0g3WKVcr.jpg',
      price: 15.00,
      avgRating: 4.6,
      totalRatings: 12,
      status: 'اون لاين',
      students: 1850, 
      learningPoints: [
        'أساسيات تحليل البيانات',
        'التعامل مع أدوات تحليل البيانات',
        'بناء التقارير الاحترافية',
        'تحليل الاتجاهات واتخاذ القرارات'
      ]
    },
    {
      id: '1008',
      name: 'دورة مهارات الخطط الاستراتيجي وبناء الخطط التشغلية',
      description: '',
      image: 'https://cdn.salla.sa/qQzmBW/b256ac48-8c66-477a-b504-5cba17f9641f-1000x1000-BSgjSuPWDfgOEtrGSLgcQtlykkmYwAmFHSZCoRKj.jpg',
      price: 15.00,
      avgRating: 4.6,
      totalRatings: 12,
      status: 'اون لاين',
      students: 1850, 
      learningPoints: [
        'أساسيات تحليل البيانات',
        'التعامل مع أدوات تحليل البيانات',
        'بناء التقارير الاحترافية',
        'تحليل الاتجاهات واتخاذ القرارات'
      ]
    }
  ];

  statusOptions: string[] = [
    'اون لاين',
    'حضوري',
    'مسجل'
  ];

  showDetails = false;

  cards = [
    {
      name: 'حسن نافع',
      rating: 5,
      image: '../../../assets/man.png',
      title: 'Card 1',
      description: '',
    },
    {
      name: 'رياء القحطاني',
      rating: 4.5,
      image: '../../../assets/woman.png',
      title: 'Card 2',
      description: '',
    },
    {
      name: 'سليمان ن',
      rating: 5,
      image: '../../../assets/man.png',
      title: 'Card 3',
      description: '',
    },
  ];

  tracks = [
    {
      name: 'مسار السياحة والفندفة',
      image: 'https://cdn.salla.sa/qQzmBW/lYss0d85pMDEsBKVBE4mlBjmzHq0etKanDJ4WhD5.png',
      url: 'https://salla.sa/righttrack.com/%D9%85%D8%B3%D8%A7%D8%B1-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D8%A9-%D9%88%D8%A7%D9%84%D9%81%D9%86%D8%AF%D9%81%D8%A9/c219414587',
      description: '',
    },
    {
      name: 'مسار الذكاء الاصطناعي وتقتنية المعلومات',
      image: 'https://cdn.salla.sa/qQzmBW/DuNJRr4IJWB7VXdXoeGIS0zQ8yO6Pa65a3z0xYwU.png',
      url: 'https://salla.sa/righttrack.com/%D9%85%D8%B3%D8%A7%D8%B1-%D8%A7%D9%84%D8%B0%D9%83%D8%A7%D8%A1-%D8%A7%D9%84%D8%A7%D8%B5%D8%B7%D9%86%D8%A7%D8%B9%D9%8A-%D9%88%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA/c1277699900',
      description: '',
    },
    {
      name: 'مسار الشهادات الاحترافية',
      image: 'https://cdn.salla.sa/qQzmBW/A73f0ejR7Bre6OcNGG5IoLhIHr3KejCjzSq4Hk7r.png',
      url: 'https://salla.sa/righttrack.com/%D9%85%D8%B3%D8%A7%D8%B1-%D8%A7%D9%84%D8%B4%D9%87%D8%A7%D8%AF%D8%A7%D8%AA-%D8%A7%D9%84%D8%A7%D8%AD%D8%AA%D8%B1%D8%A7%D9%81%D9%8A%D8%A9/c1414098884',
      description: '',
    },
    {
      name: 'مسار المحاسبة والمالية ',
      image: 'https://cdn.salla.sa/qQzmBW/E9t7tGfGNrIdWzs44NmHISb4uyjY9vyrD6lwoSOM.png',
      url: 'https://salla.sa/righttrack.com/%D9%85%D8%B3%D8%A7%D8%B1-%D8%A7%D9%84%D9%85%D8%AD%D8%A7%D8%B3%D8%A8%D8%A9-%D9%88%D8%A7%D9%84%D9%85%D8%A7%D9%84%D9%8A%D8%A9/c2113207280',
      description: '',
    },
    {
      name: 'مسار الصحة والسلامة المهنية',
      image: 'https://cdn.salla.sa/qQzmBW/P0dsk3gPj2QlqoJKAYy7gU4aL0UGwDsQdlzjlhhG.png',
      url: 'https://salla.sa/righttrack.com/%D9%85%D8%B3%D8%A7%D8%B1-%D8%A7%D9%84%D8%B5%D8%AD%D8%A9-%D9%88%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%D8%A9-%D8%A7%D9%84%D9%85%D9%87%D9%86%D9%8A%D8%A9/c73768693',
      description: '',
    },
    {
      name: 'مسار الموارد البشرية',
      image: 'https://cdn.salla.sa/qQzmBW/YRGRdTqA9mLgdcWcW2FUmvgCa7Y9E1nEDc8EJtHv.png',
      url: 'https://salla.sa/righttrack.com/%D9%85%D8%B3%D8%A7%D8%B1-%D8%A7%D9%84%D9%85%D9%88%D8%A7%D8%B1%D8%AF-%D8%A7%D9%84%D8%A8%D8%B4%D8%B1%D9%8A%D8%A9/c895608281',
      description: '',
    },
  ];
  

  carouselItems = [
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
    responsiveOptions: any[] | undefined;
    stats = [
      { title: 'العملاء الراضيين', targetValue: 46, currentValue: 0, suffix: 'K+' },
      { title: 'الدعم الفني', targetValue: 23, currentValue: 0, suffix: '+' },
      { title: 'عدد الشركات', targetValue: 23, currentValue: 0, suffix: 'K' },
      { title: 'عدد المستخدمين', targetValue: 55, currentValue: 0, suffix: 'K' },
    ];
  
    observer: IntersectionObserver | undefined;
    showPreloader: boolean = true; 
    constructor(private renderer: Renderer2, private el: ElementRef) {
      this.setCarouselProperties();
    }


    selectedItem: { title: string; content: string } | null = null;

    onItemSelected(event: { title: string; content: string }): void {
      // Toggle off if the same item is clicked; otherwise, display the new item's content.
      if (this.selectedItem && this.selectedItem.title === event.title) {
        this.selectedItem = null;
      } else {
        this.selectedItem = event;
      }
    }
    tooltipOptions:TooltipOptions = {
      showDelay: 150,
      tooltipEvent: 'hover',
      tooltipPosition: 'left'
  };
    ngOnInit() {
      setTimeout(() => {
        this.showPreloader = false;
      }, 3000);
      this.initIntersectionObserver();
      console.log(this.products)

      this.responsiveOptions = [
            {
                breakpoint: '1400px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '1199px',
                numVisible: 3,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '575px',
                numVisible: 1,
                numScroll: 1
            }
        ]
    }
    initIntersectionObserver(): void {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.startCountAnimation();
              this.observer!.disconnect(); // Stop observing once animation starts
            }
          });
        },
        { threshold: 0.5 } // Trigger when 50% of the section is visible
      );
  
      const section = this.el.nativeElement.querySelector('#statsSection');
      if (section) {
        this.observer.observe(section);
      }
    }
    ngAfterViewInit(): void {
      // Create an IntersectionObserver that watches the stats section.
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Debug: log entry details to confirm it's working.
            console.log('Intersection Observer:', entry.isIntersecting, entry.intersectionRatio);
            // Only trigger when at least 50% of the section is visible.
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              console.log('Starting count animation...');
              this.startCountAnimation();
              observer.unobserve(entry.target); // Ensure the animation only starts once.
            }
          });
        },
        { threshold: 0.5 }
      );
  
      // Start observing the stats section element.
      observer.observe(this.statsSection.nativeElement);
    }
    
    // Increase the numbers until they reach the target value.
    startCountAnimation(): void {
      this.stats.forEach((stat) => {
        const interval = setInterval(() => {
          stat.currentValue += 1;
          if (stat.currentValue >= stat.targetValue) {
            stat.currentValue = stat.targetValue;
            clearInterval(interval);
          }
        }, this.calculateSpeed(stat.targetValue));
      });
    }
  
    // Adjust speed dynamically based on the target value.
    calculateSpeed(targetValue: number): number {
      return targetValue < 100 ? 100 : Math.floor(2000 / targetValue);
    }
    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
              return 'undefined';
        }
    }

    numVisible: number =0;
    numScroll: number = 0;
  
    @HostListener('window:resize')
    onResize() {
      this.setCarouselProperties();
    }
  
    setCarouselProperties() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 576) {
        this.numVisible = 1;
        this.numScroll = 1;
      } else if (screenWidth >= 576 && screenWidth < 992) {
        this.numVisible = 2;
        this.numScroll = 2;
      } else {
        this.numVisible = 3;
        this.numScroll = 3;
      }
    }



    header: string = 'شركائنا';

    partiners: string[] = [
      '/assets/partners/Logo1.png',
      '/assets/partners/Logo2.png',
      '/assets/partners/Logo3.png',
      '/assets/partners/Logo4.png',
      '/assets/partners/Logo5.png',
      '/assets/partners/Logo6.png',
      '/assets/partners/Logo7.png',
      '/assets/partners/Logo8.png',
      '/assets/partners/Logo9.png',
      '/assets/partners/Logo10.png',
      '/assets/partners/Logo11.png',
    ];
  
    @ViewChildren('slides') slides!: QueryList<ElementRef>;
  
    speed = 2; // سرعة التحرك بالبكسل
    containerWidth = 0;
    startAnimation() {
      const slideElements = this.slides.toArray();
      if (slideElements.length === 0) return;
  
      const container = slideElements[0].nativeElement.parentElement;
      this.containerWidth = container.clientWidth;
      let positions = slideElements.map((_, i: number) => i * 150); // كل عنصر يبدأ بفارق معين
  
      const animate = () => {
        slideElements.forEach((slide: any, index: number) => {
          positions[index] -= this.speed;
          if (positions[index] < -150) {
            positions[index] = this.containerWidth; // يرجع من اليمين
          }
          slide.nativeElement.style.transform = `translateX(${positions[index]}px)`;
        });
  
        requestAnimationFrame(animate);
      };
  
      animate();
    }


    print(index:any){
      console.log(index)
    }
}
