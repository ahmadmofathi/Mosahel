import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureCardComponent } from './feature-card/feature-card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-choose-danat',
  standalone: true,
  imports: [CommonModule, FeatureCardComponent, TranslateModule],
  templateUrl: './choose-danat.component.html',
  styleUrl: './choose-danat.component.scss',
})
export class ChooseDanatComponent {}
