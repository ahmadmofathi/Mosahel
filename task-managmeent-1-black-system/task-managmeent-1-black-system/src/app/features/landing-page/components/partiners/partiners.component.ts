import { CommonModule, NgForOf } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from '@angular/core';

@Component({
  selector: 'app-partiners',
  standalone: true,
  imports: [NgForOf, CommonModule],
  templateUrl: './partiners.component.html',
  styleUrls: ['./partiners.component.scss'],
})
export class PartinersComponent implements AfterViewInit {
  header: string = 'شركائنا';

  partiners: string[] = [
    '/images/p1.png',
    '/images/p2.png',
    '/images/p4.png',
    '/images/p5.png',
    '/images/p6.png',
    '/images/p7.jpg',
    '/images/p8.jpg',
    '/images/p9.jpg',
    '/images/p10.jpg',
    '/images/p11.jpg',
    '/images/p12.jpg',
    '/images/p13.jpg',
  ];

  @ViewChildren('slides') slides!: QueryList<ElementRef>;

  speed = 2; // سرعة التحرك بالبكسل
  containerWidth = 0;

  ngAfterViewInit() {
    this.startAnimation();
  }

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
}
