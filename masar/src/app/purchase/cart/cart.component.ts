import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
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
