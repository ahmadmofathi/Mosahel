import { NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinner, NgIf],
  template: `
    <div *ngIf="isLoading" class="overlay">
      <mat-progress-spinner
        mode="indeterminate"
        color="primary"
        diameter="50"
      ></mat-progress-spinner>
    </div>
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
    `,
  ],
})
export class LoadingSpinnerComponent implements OnChanges {
  @Input() isLoading: boolean | null = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLoading']) {
      console.log('Loading state changed:', changes['isLoading'].currentValue);
    }
  }
}
