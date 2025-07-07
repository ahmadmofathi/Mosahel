import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-crm-details',
  standalone: true,
  imports: [],
  templateUrl: './crm-details.component.html',
  styleUrl: './crm-details.component.scss',
})
export class CrmDetailsComponent {
  constructor(
    private dialogRef: MatDialogRef<CrmDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public customerData: any
  ) {
    console.log(customerData);
  }

  onCancel() {
    this.dialogRef.close(); // Close the dialog without submitting
  }
}
