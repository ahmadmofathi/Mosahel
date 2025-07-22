import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SponsorCardComponent } from './sponsor-card/sponsor-card.component';

@Component({
  selector: 'app-sponsors',
  standalone: true,
  imports: [SponsorCardComponent, TranslateModule],
  templateUrl: './sponsors.component.html',
  styleUrl: './sponsors.component.scss',
})
export class SponsorsComponent {
  sponsoreList: any[] = [
    {
      id: 3,
      img: 'images/hr3.png',
      name: 'Sponsor 2',
    },
    {
      id: 1,
      img: 'images/work1.png',
      name: 'Sponsor 1',
    },
    {
      id: 2,
      img: 'images/motsaql-work.jpg',
      name: 'Sponsor 2',
    },
    {
      id: 4,
      img: 'images/hr3.png',
      name: 'Sponsor 4',
    },
    {
      id: 3,
      img: 'images/work1.png',
      name: 'Sponsor 3',
    },
    {
      id: 4,
      img: 'images/motsaql-work.jpg',
      name: 'Sponsor 4',
    },
    {
      id: 6,
      img: 'images/hr3.png',
      name: 'Sponsor 6',
    },
    {
      id: 5,
      img: 'images/work1.png',
      name: 'Sponsor 5',
    },
    {
      id: 6,
      img: 'images/motsaql-work.jpg',
      name: 'Sponsor 6',
    },
    {
      id: 2,
      img: 'images/hr3.png',
      name: 'Sponsor 2',
    },
    {
      id: 1,
      img: 'images/work1.png',
      name: 'Sponsor 1',
    },
    {
      id: 2,
      img: 'images/motsaql-work.jpg',
      name: 'Sponsor 2',
    },
    {
      id: 4,
      img: 'images/hr3.png',
      name: 'Sponsor 4',
    },
    {
      id: 3,
      img: 'images/work1.png',
      name: 'Sponsor 3',
    },
    {
      id: 4,
      img: 'images/motsaql-work.jpg',
      name: 'Sponsor 4',
    },
    {
      id: 6,
      img: 'images/hr3.png',
      name: 'Sponsor 6',
    },
    {
      id: 5,
      img: 'images/work1.png',
      name: 'Sponsor 5',
    },
    {
      id: 6,
      img: 'images/motsaql-work.jpg',
      name: 'Sponsor 6',
    },
  ];

  ngOnInit(): void {}
}
