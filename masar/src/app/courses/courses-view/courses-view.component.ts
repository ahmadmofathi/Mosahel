import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses-view',
  templateUrl: './courses-view.component.html',
  styleUrl: './courses-view.component.css'
})
export class CoursesViewComponent {
  statusOptions: string[] = [
    'اون لاين',
    'حضوري',
    'مسجل'
  ];
  constructor(private router:Router){}
  navigateToCourseDetails() {
    this.router.navigate(['course']);
  }
}
