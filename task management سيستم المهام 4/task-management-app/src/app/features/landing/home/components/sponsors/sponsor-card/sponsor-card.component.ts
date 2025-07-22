import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-sponsor-card',
  standalone: true,
  imports: [],
  templateUrl: './sponsor-card.component.html',
  styleUrl: './sponsor-card.component.scss',
  providers: [],
})
export class SponsorCardComponent {
  visible = signal(false);
  sponsor = input({} as any);
}
