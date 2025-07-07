import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-support-details',
  standalone: true,
  imports: [],
  templateUrl: './support-details.component.html',
  styleUrl: './support-details.component.scss',
})
export class SupportDetailsComponent {
  constructor(
    private dialogRef: MatDialogRef<SupportDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { problem: string }
  ) {}

  
  onCancel() {
    this.dialogRef.close(); // Close the dialog without submitting
  }
}
