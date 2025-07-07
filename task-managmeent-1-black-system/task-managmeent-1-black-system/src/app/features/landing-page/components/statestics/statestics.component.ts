import { NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-statestics',
  standalone: true,
  imports: [NgFor],
  templateUrl: './statestics.component.html',
  styleUrl: './statestics.component.scss',
})
export class StatesticsComponent implements AfterViewInit {
  data: any[] = [
    { count: 342, name: 'عدد العملاء', current: 0 },
    { count: 112, name: 'عدد العقود', current: 0 },
    { count: 22, name: 'عدد الخدمات', current: 0 },
    { count: 6, name: 'عدد المشاريع القائمة', current: 0 },
  ];

  @ViewChild('statContainer') statContainer!: ElementRef;

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startCounting();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(this.statContainer.nativeElement);
  }

  startCounting() {
    this.data.forEach((item) => {
      let start = 0;
      const step = Math.ceil(item.count / 50); // زيادة تدريجية
      const interval = setInterval(() => {
        start += step;
        if (start >= item.count) {
          item.current = item.count;
          clearInterval(interval);
        } else {
          item.current = start;
        }
      }, 30);
    });
  }
}
