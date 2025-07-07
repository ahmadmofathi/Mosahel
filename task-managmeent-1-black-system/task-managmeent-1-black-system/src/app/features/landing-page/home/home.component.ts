import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HeroComponent } from '../components/hero/hero.component';
import { ServicesComponent } from '../components/services/services.component';
import { TestimonialsComponent } from '../components/testimonials/testimonials.component';
import { WhyUsComponent } from '../components/why-us/why-us.component';
import { StatesticsComponent } from '../components/statestics/statestics.component';
import { PartinersComponent } from '../components/partiners/partiners.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    ServicesComponent,
    TestimonialsComponent,
    WhyUsComponent,
    StatesticsComponent,
    TestimonialsComponent,
    PartinersComponent,
    FooterComponent,
    NgIf,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
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
