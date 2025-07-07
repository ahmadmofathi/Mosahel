import { Component } from '@angular/core';

@Component({
  selector: 'app-course-view',
  templateUrl: './course-view.component.html',
  styleUrl: './course-view.component.css'
})
export class CourseViewComponent {
  stars =5;
  cards = [
    {
      name: 'Ahmed Hassan Ali',
      rating: 5,
      image: '../../../assets/man.png',
      description: 'هذا النص تم تغييره تلقائيا بعد البرمجة هذا النص تم تغييره تلقائيا بعد البرمجة ',
    },
    {
      name: 'Ahmed Hassan Ali',
      rating: 4.5,
      image: '../../../assets/man.png',
      description: 'هذا النص تم تغييره تلقائيا بعد البرمجة هذا النص تم تغييره تلقائيا بعد البرمجة ',
    },
    {
      name: 'Ahmed Hassan Ali',
      rating: 4,
      image: '../../../assets/man.png',
      description: 'هذا النص تم تغييره تلقائيا بعد البرمجة هذا النص تم تغييره تلقائيا بعد البرمجة ',
    },
  ];
}
