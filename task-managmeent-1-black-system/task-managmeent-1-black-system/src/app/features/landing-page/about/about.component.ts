import { Component, OnInit } from '@angular/core';
import { TestimonialsComponent } from '../components/testimonials/testimonials.component';
import { StatesticsComponent } from '../components/statestics/statestics.component';
import { PartinersComponent } from '../components/partiners/partiners.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NgIf } from '@angular/common';
import { AboutSectonComponent } from '../components/about-secton/about-secton.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    AboutSectonComponent,
    TestimonialsComponent,
    StatesticsComponent,
    TestimonialsComponent,
    PartinersComponent,
    FooterComponent,
    NgIf,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  loading: boolean = true;
  onLoadingChanged(isLoading: boolean) {
    console.log('حالة التحميل:', isLoading);
    // this.loading = isLoading === true;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }
}
