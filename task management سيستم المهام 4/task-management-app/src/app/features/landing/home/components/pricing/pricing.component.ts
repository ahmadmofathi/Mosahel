import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
})
export class PricingComponent {
  stopPropagation(event: any): void {
    event.stopPropagation();
  }
  plans = [
    {
      name: 'home.pricing.PLANS.BASIC.NAME',
      price: 99,
      type: 'home.pricing.PLANS.BASIC.TYPE',
      title: 'home.pricing.PLANS.BASIC.title',
      features: [
        'home.pricing.PLANS.BASIC.FEATURES.FEATURE1',
        'home.pricing.PLANS.BASIC.FEATURES.FEATURE2',
        'home.pricing.PLANS.BASIC.FEATURES.FEATURE3',
        'home.pricing.PLANS.BASIC.FEATURES.FEATURE4',
        'home.pricing.PLANS.BASIC.FEATURES.FEATURE5',
        'home.pricing.PLANS.BASIC.FEATURES.FEATURE6',
      ],
      hovered: false,
      img: 'images/pricing/Basic.png',
    },
    {
      name: 'home.pricing.PLANS.SILVER.NAME',
      price: 200,
      type: 'home.pricing.PLANS.SILVER.TYPE',
      title: 'home.pricing.PLANS.SILVER.title',
      features: [
        'home.pricing.PLANS.SILVER.FEATURES.FEATURE1',
        'home.pricing.PLANS.SILVER.FEATURES.FEATURE2',
        'home.pricing.PLANS.SILVER.FEATURES.FEATURE3',
        'home.pricing.PLANS.SILVER.FEATURES.FEATURE4',
        'home.pricing.PLANS.SILVER.FEATURES.FEATURE5',
        'home.pricing.PLANS.SILVER.FEATURES.FEATURE6',
        'home.pricing.PLANS.SILVER.FEATURES.FEATURE7',
        'home.pricing.PLANS.SILVER.FEATURES.FEATURE8',
        'home.pricing.PLANS.SILVER.FEATURES.FEATURE9',
        'home.pricing.PLANS.SILVER.FEATURES.FEATURE10',
        'home.pricing.PLANS.SILVER.FEATURES.FEATURE11',
        'home.pricing.PLANS.SILVER.FEATURES.FEATURE12',
      ],
      hovered: false,
      img: 'images/pricing/Silver.png',
    },
    {
      name: 'home.pricing.PLANS.PLATINUM_REMOTE.NAME',
      price: 400,
      type: 'home.pricing.PLANS.PLATINUM_REMOTE.TYPE',
      title: 'home.pricing.PLANS.PLATINUM_REMOTE.title',
      features: [
        'home.pricing.PLANS.PLATINUM_REMOTE.FEATURES.FEATURE1',
        'home.pricing.PLANS.PLATINUM_REMOTE.FEATURES.FEATURE2',
        'home.pricing.PLANS.PLATINUM_REMOTE.FEATURES.FEATURE3',
        'home.pricing.PLANS.PLATINUM_REMOTE.FEATURES.FEATURE4',
        'home.pricing.PLANS.PLATINUM_REMOTE.FEATURES.FEATURE5',
        'home.pricing.PLANS.PLATINUM_REMOTE.FEATURES.FEATURE6',
        'home.pricing.PLANS.PLATINUM_REMOTE.FEATURES.FEATURE7',
        'home.pricing.PLANS.PLATINUM_REMOTE.FEATURES.FEATURE8',
        'home.pricing.PLANS.PLATINUM_REMOTE.FEATURES.FEATURE9',
        'home.pricing.PLANS.PLATINUM_REMOTE.FEATURES.FEATURE10',
        'home.pricing.PLANS.PLATINUM_REMOTE.FEATURES.FEATURE11',
        'home.pricing.PLANS.PLATINUM_REMOTE.FEATURES.FEATURE12',
        'home.pricing.PLANS.PLATINUM_REMOTE.FEATURES.FEATURE13',
      ],
      hovered: false,
      img: 'images/pricing/Gold.png',
    },
  ];

  showPopup = false;
  selectedPlan: any = null;

  setHover(index: number, value: boolean) {
    this.plans[index].hovered = value;
  }

  openFeaturePopup(plan: any) {
    this.selectedPlan = plan;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.selectedPlan = null;
  }
}
