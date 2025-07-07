import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NavComponent } from '../nav/nav.component';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NavComponent, MatCardModule, NgFor, CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit {
  @Output() loadingState = new EventEmitter<boolean>(); // Correct way to define an output event
  loading: boolean = true;

  showPlayButton = false; // لإظهار زر التشغيل إذا فشل التشغيل التلقائي

  @ViewChild('videoPlayer') videoElement!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    this.tryAutoPlay();
  }

  tryAutoPlay() {
    const video = this.videoElement.nativeElement;
    video.muted = true;
    video
      .play()
      .then(() => {
        console.log('✅ الفيديو يعمل تلقائيًا');
      })
      .catch((error) => {
        console.warn('⚠️ فشل التشغيل التلقائي، يتطلب تفاعل المستخدم:', error);
        this.showPlayButton = true; // إظهار زر التشغيل اليدوي
      });
  }

  playVideo() {
    this.videoElement.nativeElement.play();
    this.showPlayButton = false; // إخفاء الزر بعد التشغيل
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.playVideo();
    }, 1000);
  }

  handleVideoLoaded() {
    this.loading = false;
    console.log('loaded');
    this.loadingState.emit(this.loading); // Emit the updated state
  }

  // Video is buffering or waiting for data
  handleVideoLoading() {
    this.loading = true;
    console.log('loading');
    this.loadingState.emit(this.loading);
  }

  // Video failed to load
  handleVideoError() {
    console.error('Failed to load video');
    this.loading = false;
    console.log('error');
    this.loadingState.emit(this.loading);
  }

  contentSections: {
    header: string;
    description: string;
    callToAction: string;
  }[] = [
    {
      header: 'كفاءة تشغيلية وريادة مستدامة',
      description:
        'نقدم حلولاً استشارية متكاملة تجمع بين أفضل الممارسات العالمية وفهم عميق للسوق المحلي، مع التركيز على الابتكار والتحول الرقمي والاستدامة.',
      callToAction: 'تواصل معنا',
    },
    {
      header: 'حلول مبتكرة لتحديات الأعمال',
      description:
        'نساعد الشركات في تحقيق أهدافها من خلال حلول مبتكرة تعتمد على أحدث التقنيات، مما يساهم في تحسين الأداء وزيادة الإنتاجية.',
      callToAction: 'تواصل معنا',
    },
    {
      header: 'التحول الرقمي والاستدامة',
      description:
        'نقدم استراتيجيات رقمية متطورة تركز على الاستدامة، مما يمكن الشركات من التكيف مع التطورات السريعة وتعزيز مكانتها التنافسية.',
      callToAction: 'تواصل معنا',
    },
  ];

  currentIndex: number = 0;
  interval: any;

  constructor() {
    this.startAutoSlide();
  }

  startAutoSlide() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change every 5 seconds
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.contentSections.length;
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.contentSections.length) %
      this.contentSections.length;
  }

  setSlide(index: number) {
    this.currentIndex = index;
  }
  cards: any[] = [
    {
      logo: '/images/a3.png',
      header: 'التمــــــــيز',
      description:
        'نلتزم بتقديم حلول وخدمات عالية الجودة تحقق التفوق والريادة في مجال خدمات الأعمال.',
    },
    {
      logo: '/images/a2.png',
      header: 'الابتــــــكار',
      description:
        'نلتزم بتقديم حلول وخدمات عالية الجودة تحقق التفوق والريادة في مجال خدمات الأعمال.',
    },
    {
      logo: '/images/a1.png',
      header: 'الشفــافـية',
      description:
        'نحرص على بناء علاقات قائمة على الوضوح والثقة المتبادلة مع عملائنا وشركائنا.',
    },
    {
      logo: '/images/a4.png',
      header: 'التفـــــــاني',
      description:
        'نعمل بروح الفريق لتقديم أفضل ما لدينا من خبرات وإمكانات لدعم نجاح عملائنا.',
    },
    {
      logo: '/images/a5.png',
      header: 'الشــــــــراكة',
      description:
        'نسعى إلى بناء شراكات استراتيجية طويلة الأمد، ترتكز على تحقيق المصالح المشتركة وتعزيز النمو المتبادل.',
    },
    {
      logo: '/images/a6.png',
      header: 'الاستــدامة',
      description:
        'ضع الاستدامة في صميم أعمالنا، ونعمل على تحقيق قيمة مستدامة لعملائنا وشركائنا.',
    },
  ];
  bgVideo: string = '/videos/hero-video-1.mp4';
  poster: string = '/videos/bgVideoPoster.png';
}
