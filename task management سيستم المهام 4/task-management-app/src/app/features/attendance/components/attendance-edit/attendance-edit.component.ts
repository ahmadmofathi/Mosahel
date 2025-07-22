import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-attendance-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './attendance-edit.component.html',
  styleUrl: './attendance-edit.component.scss'
})
export class AttendanceEditComponent {
  attendance: {
    attendanceId: number;
    checkIn: string;
    lastCheckOut: string;
  };
  constructor(
    public dialogRef: MatDialogRef<AttendanceEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data ,"from dialog")
    this.attendance = {
      attendanceId: data.attendanceId,
      checkIn: this.formatDateForInput(data.checkIn),
      lastCheckOut: this.formatDateForInput(data.lastCheckOut)
    };
  }
  formatDateForInput(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    // Convert to local time by subtracting the timezone offset
    const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.attendance);
  }
}
