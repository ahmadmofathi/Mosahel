import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RawImg } from '../../ui/raw-img.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [CommonModule, RawImg, TranslateModule, RouterModule],
  styles: `
  .active{
    color: #DF8317;
    border-bottom: 3px solid #DF8317;
    padding-bottom:6px;
  }

  a:hover{
    color: #DF8317;
    border-bottom: 3px solid #DF8317;
    padding-bottom:6px;
    transition: color 0.7s;
  }

//   nav {
//   position: sticky;
//   top: 0;
//   z-index: 50;
//   background: #172554; /* Adjust to match your design */
//   transition: top 0.3s ease-in-out;
// }
  `,
  template: `
    <nav
      class="md:sticky md:top-0 md:z-50 transition-[top] bg-blue-950 duration-500 ease-in-out flex justify-between items-center max-sm:px-4 px-10 py-5 border-b border-solid border-b-zinc-300 max-md:flex-col max-md:gap-5"
    >
      <raw-img
        image="images/logo-white.png"
        altText="Logo"
        class="h-[60px] w-[202px]"
      />
      <div class="flex gap-8 max-sm:gap-3 ">
        <a
          routerLink="/"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="text-lg max-sm:text-sm font-semibold text-white"
          >{{ 'myHome' | translate }}</a
        >
        <a
          [routerLink]="['/']"
          fragment="about"
          class="text-lg max-sm:text-sm font-semibold text-white"
        >
          {{ 'about' | translate }}
        </a>

        <a
          [routerLink]="['/']"
          fragment="whyUs"
          class="text-lg max-sm:text-sm font-semibold text-white"
        >
          {{ 'whyUs' | translate }}
        </a>

        <a
          [routerLink]="['/']"
          fragment="packages"
          class="text-lg max-sm:text-sm font-semibold text-white"
        >
          {{ 'packages' | translate }}
        </a>
        <a
          routerLink="/services"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="text-lg max-sm:text-sm font-semibold text-white"
          >{{ 'services' | translate }}</a
        >
        <a
          routerLink="/employeer"
          routerLinkActive="active"
          class="text-lg max-sm:text-sm font-semibold text-white"
          >{{ 'employment' | translate }}</a
        >
      </div>

      <div class="flex gap-5 items-center max-sm:flex-col">
        @if (currentLang =='ar') {
        <button
          class="flex items-center gap-1 text-white text-xl"
          (click)="switchLanguage('en')"
        >
          <span class="pi pi-globe"></span>
          <span>English</span>
        </button>
        }@else {
        <button
          class="flex items-center gap-1 text-white text-xl"
          (click)="switchLanguage('ar')"
        >
          <span class="pi pi-globe"></span>
          <span>العربيه</span>
        </button>
        }

        <a
          routerLink="/dashboard"
          class="px-5 py-2 text-lg font-semibold hover:border-[#DF8317] transition-all transition-duration-1000 text-white rounded-xl border-2 border-solid border-white border-opacity-70 max-sm:w-full max-sm:text-center"
        >
          {{ 'danatPlatform' | translate }}
        </a>
      </div>
    </nav>
    <div class="bg-blue-950 pt-10 max-md:pt-0">
      <div
        class="ms-10 flex relative justify-between items-center pt-7 p-5 bg-white rounded-md w-[357px] max-md:m-0 max-md:w-full"
      >
        <div
          class="absolute top-0 text-gray-500"
          style="inset-inline-start: 5px;"
        >
          {{ 'provider' | translate }}
        </div>
        <raw-img image="images/hr.png" class="h-[30px]" />
        <div class="w-0.5 bg-zinc-300 h-[30px]"></div>
        <raw-img image="images/motsaql-work.jpg" class="h-[40px]" />
        <div class="w-0.5 bg-zinc-300 h-[30px]"></div>
        <raw-img image="images/work1.png" class="h-[40px]" />
      </div>
    </div>
  `,
})
export class NavBar {
  constructor(private translate: TranslateService) {}
  switchLanguage(language: string) {
    this.translate.use(language);
    this.currentLang = language;
    localStorage.setItem('language', language);
    // Set page direction dynamically
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }
  currentLang = localStorage.getItem('language') ?? 'en';
}
