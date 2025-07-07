import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-contract-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.scss'],
})
export class ContractDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<ContractDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
