import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorSubject = new Subject<string>();
  error$ = this.errorSubject.asObservable();

  constructor(private snackBar: MatSnackBar) {}

  showError(message: string) {
    this.errorSubject.next(message);
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
