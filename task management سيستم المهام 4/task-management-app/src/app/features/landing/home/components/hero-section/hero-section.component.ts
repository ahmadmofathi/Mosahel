import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'hero-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="relative p-10 max-sm:min-h-[40vh]">
      <article class="max-sm:py-6">
        <h1
          class="mb-2 md:mb-8 md:pt-10 text-5xl font-semibold max-sm:text-3xl text-white"
        >
          {{ 'home.title' | translate }}
        </h1>

        <p
          class=" text-xl lg:max-w-[415px] font-semibold text-white opacity-70 md:leading-10 max-sm:text-base"
        >
          {{ 'home.heroSubTitle' | translate }}
        </p>
      </article>
    </section>
  `,
})
export class HeroSection {}
