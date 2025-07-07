import { Component } from '@angular/core';
import { SupportListComponent } from '../support-list/support-list.component';
import { SupportFormComponent } from '../support-form/support-form.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [SupportListComponent, SupportFormComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  currentRole = localStorage.getItem('role') ?? '';
}
