import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-service-request-info',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule],
  templateUrl: './service-request-info.component.html',
  styleUrl: './service-request-info.component.scss'
})
export class ServiceRequestInfoComponent {
  constructor(
    private dialogRef: MatDialogRef<ServiceRequestInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(){
    this.dialogRef.close();
  }
}
