import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-improve-levels',
  standalone: true,
  imports: [TranslateModule],
  template: `<main id="about" class="p-0 mx-auto my-5 w-full max-w-[1290px]">
    <header class="flex flex-col items-center py-6">
      <div class="flex items-center">
        <h1 class="mb-2.5 text-4xl font-bold text-center max-sm:text-3xl">
          <span class="text-indigo-950">
            {{ 'home.improve.preTitle' | translate }}
          </span>
          <span class="text-amber-600">
            {{ 'home.improve.postTitle' | translate }}</span
          >
        </h1>
        <div class="mb-2.5">
          <svg
            width="35"
            height="36"
            viewBox="0 0 35 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="star"
          >
            <path
              d="M10.5 3.70831L11.6667 7.93748M7.43751 12.1666L3.20834 11M20.4167 6.47915L17.5 9.24998M8.75001 18L5.97918 20.9166M13.125 13.625L20.4167 31.125L23.0417 23.5416L30.625 20.9166L13.125 13.625Z"
              stroke="#DF8317"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </div>
      </div>
      <!-- <p
        class="mx-auto my-0 text-xl text-center max-w-[678px] text-slate-500 max-sm:px-5 max-sm:py-0 max-sm:text-base"
      >
        {{ 'home.improve.subTitle' | translate }}
      </p> -->
    </header>

    <section
      class="flex gap-5 justify-center items-center px-0 pt-8 pb-16 max-md:flex-col max-md:gap-10"
    >
      <!-- Step 3 -->
      <article
        class="flex flex-col items-center text-center w-[236px] max-sm:w-full max-sm:max-w-[280px]"
      >
        <svg
          width="81"
          height="88"
          viewBox="0 0 81 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="number-circle"
        >
          <circle cx="40.125" cy="48" r="40" fill="#111C55" />
          <text
            fill="white"
            xml:space="preserve"
            font-family="Cairo"
            font-size="45"
            font-weight="600"
            letter-spacing="0em"
            text-anchor="middle"
            dominant-baseline="middle"
            x="48%"
            y="60%"
          >
            <tspan>1</tspan>
          </text>
        </svg>

        <div>
          <h2
            class="mb-2.5 text-2xl font-semibold text-slate-800 max-sm:text-xl"
          >
            {{ 'home.improve.3main' | translate }}
          </h2>
        </div>
      </article>

      <!-- Dotted Line 1 -->
      <div>
        <svg
          width="153"
          height="22"
          viewBox="0 0 153 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="dotted-line"
        >
          <path
            d="M1.5 9.89108C1.5 9.89108 34.1087 -11.0778 73.832 11.3889C113.555 33.8555 151.5 9.89108 151.5 9.89108"
            stroke="#111C55"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-dasharray="4 8"
          />
        </svg>
      </div>

      <!-- Step 2 -->
      <article
        class="flex flex-col items-center text-center w-[236px] max-sm:w-full max-sm:max-w-[280px]"
      >
        <svg
          width="81"
          height="88"
          viewBox="0 0 81 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="number-circle"
        >
          <circle cx="40.125" cy="48" r="40" fill="#DF8317" />
          <text
            fill="white"
            xml:space="preserve"
            font-family="Cairo"
            font-size="45"
            font-weight="600"
            letter-spacing="0em"
            text-anchor="middle"
            dominant-baseline="middle"
            x="48%"
            y="60%"
          >
            <tspan>2</tspan>
          </text>
        </svg>

        <div>
          <h2
            class="mb-2.5 text-2xl font-semibold text-slate-800 max-sm:text-xl"
          >
            {{ 'home.improve.2main' | translate }}
          </h2>
        </div>
      </article>

      <!-- Dotted Line 2 -->
      <div>
        <svg
          width="153"
          height="22"
          viewBox="0 0 153 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="dotted-line"
        >
          <path
            d="M1.5 9.89108C1.5 9.89108 34.1087 -11.0778 73.832 11.3889C113.555 33.8555 151.5 9.89108 151.5 9.89108"
            stroke="#111C55"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-dasharray="4 8"
          />
        </svg>
      </div>
      <article
        class="flex flex-col items-center text-center w-[236px] max-sm:w-full max-sm:max-w-[280px]"
      >
        <svg
          width="81"
          height="88"
          viewBox="0 0 81 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="number-circle"
        >
          <circle cx="40.125" cy="48" r="40" fill="#111C55" />
          <text
            fill="white"
            xml:space="preserve"
            font-family="Cairo"
            font-size="45"
            font-weight="600"
            letter-spacing="0em"
            text-anchor="middle"
            dominant-baseline="middle"
            x="48%"
            y="60%"
          >
            <tspan>3</tspan>
          </text>
        </svg>

        <div>
          <h2
            class="mb-2.5 text-2xl font-semibold text-slate-800 max-sm:text-xl"
          >
            {{ 'home.improve.1main' | translate }}
          </h2>
        </div>
      </article>
      <!-- Step 1 -->
    </section>
  </main> `,
})
export class ImproveLevelsComponent {}
