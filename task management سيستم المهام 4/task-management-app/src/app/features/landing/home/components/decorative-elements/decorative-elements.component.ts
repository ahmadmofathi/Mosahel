import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'decorative-elements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="absolute top-0 left-0 pointer-events-none size-full">
      <svg
        width="88"
        height="89"
        viewBox="0 0 88 89"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.26952 88C-0.155836 70.0015 -4.151 35.388 31.2711 40.9226C75.5488 47.8408 64.963 65.1099 59.899 70.2828C56.2236 74.0373 47.873 75.0621 43.6766 58.3025C39.4745 41.5204 38.3327 -8.01088 87 3.80066"
          stroke="#FCA61F"
          stroke-opacity="0.4"
          stroke-width="3"
        />
      </svg>

      <svg
        width="36"
        height="38"
        viewBox="0 0 36 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.98467 34.2755L7.8261 4.35374L31.3184 23.5074L2.98467 34.2755Z"
          stroke="#F8C953"
          stroke-opacity="0.47"
          stroke-width="4"
        />
      </svg>

      <div
        class="absolute border-4 border-solid border-emerald-300 border-opacity-50 h-[35px] left-[255px] rotate-[-26.617deg] top-[578px] w-[35px]"
      ></div>

      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="11" cy="11" r="11" fill="#B16EE6" fill-opacity="0.58" />
      </svg>
    </div>
  `,
})
export class DecorativeElements {}
