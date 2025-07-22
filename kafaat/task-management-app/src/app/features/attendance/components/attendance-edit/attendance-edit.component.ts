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
  styleUrls: ['./attendance-edit.component.scss']
})
export class AttendanceEditComponent {
  attendance: {
    attendanceId: number;
    checkIn: string;
    lastCheckOut: string;
  };

  // These properties hold the separated date and time parts.
  checkInDate: string;
  checkInTime: string;
  lastCheckOutDate: string;
  lastCheckOutTime: string;

  constructor(
    public dialogRef: MatDialogRef<AttendanceEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Parse the provided datetime into date and time parts
    const checkInParsed = this.parseDateForTimeEditing(data.checkIn);
    this.checkInDate = checkInParsed.date;
    this.checkInTime = checkInParsed.time;

    if(data.lastCheckOut){
      const lastCheckOutParsed = this.parseDateForTimeEditing(data.lastCheckOut);
      this.lastCheckOutDate = lastCheckOutParsed.date;
      this.lastCheckOutTime = lastCheckOutParsed.time;
    }
    else{
      this.lastCheckOutDate = checkInParsed.date;
      this.lastCheckOutTime = checkInParsed.time;
    }

    // Store original attendance data if needed later
    this.attendance = {
      attendanceId: data.attendanceId,
      checkIn: data.checkIn,
      lastCheckOut: data.lastCheckOut
    };
    console.log(this.attendance)
  }

  /**
   * Splits a datetime string into a date part (YYYY-MM-DD) and a time part (HH:mm)
   * using local time.
   */
  parseDateForTimeEditing(dateStr: string): { date: string; time: string } {
    if (!dateStr) return { date: '', time: '' };
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return { date: `${year}-${month}-${day}`, time: `${hours}:${minutes}` };
  }

  /**
   * Combines a date string (YYYY-MM-DD) with a time string (HH:mm) into a Date object
   * assuming the values are in local time.
   */
  combineDateAndTime(date: string, time: string): Date {
    // The string "YYYY-MM-DDTHH:mm:00" is interpreted as local time.
    return new Date(`${date}T${time}:00`);
  }

  /**
   * Formats a Date object as a local datetime string (YYYY-MM-DDTHH:mm:ss)
   * without converting it to UTC.
   */
  formatLocalDateTime(date: Date): string {
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds())
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Combine the original date with the edited time as local time
    const checkInDateObj = this.combineDateAndTime(this.checkInDate, this.checkInTime);
    const lastCheckOutDateObj = this.combineDateAndTime(this.lastCheckOutDate, this.lastCheckOutTime);

    // Format as a local datetime string (preserving the user input)
    const checkInLocal = this.formatLocalDateTime(checkInDateObj);
    const lastCheckOutLocal = this.formatLocalDateTime(lastCheckOutDateObj);

    this.dialogRef.close({
      attendanceId: this.attendance.attendanceId,
      checkIn: checkInLocal,
      lastCheckOut: lastCheckOutLocal
    });
  }
}
