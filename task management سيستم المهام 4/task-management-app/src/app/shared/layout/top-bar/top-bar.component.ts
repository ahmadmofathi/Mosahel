import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'top-bar',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  styles: `
  button:hover {
  transform: scale(1.05);
}
`,
  template: `
    <header
      class="flex justify-between px-10 py-5 text-white max-sm:flex-col max-sm:gap-5 max-sm:items-center"
    >
      <nav class="flex gap-2.5">
        <span class="pi pi-youtube hover:text-gray-300 cursor-pointer"></span>
        <span class="pi pi-twitter hover:text-gray-300 cursor-pointer"></span>
        <span class="pi pi-facebook hover:text-gray-300 cursor-pointer"></span>
        <span class="pi pi-instagram hover:text-gray-300 cursor-pointer"></span>
        <span class="pi pi-tiktok hover:text-gray-300 cursor-pointer"></span>
        <span class="pi pi-whatsapp hover:text-gray-300 cursor-pointer"></span>
      </nav>
      <button
        (click)="scrollToBottom()"
        class="flex gap-5 max-sm:flex-col max-sm:items-center bg-[#d8540c] rounded-lg p-2 px-4 cursor-pointer"
      >
        {{ 'contactUs' | translate }}
      </button>
    </header>
  `,
})
export class TopBar {
  scrollToBottom(): void {
    // This will scroll to the bottom of the page
    window.scrollTo(0, document.body.scrollHeight);
  }
}
