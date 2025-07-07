import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getList(inputFilter?: any) {
    let params = new HttpParams();

    // Add parameters dynamically if `inputFilter` is provided
    if (inputFilter) {
      Object.keys(inputFilter).forEach((key) => {
        if (inputFilter[key] !== '' && inputFilter[key] !== null) {
          params = params.set(key, inputFilter[key]);
        }
      });
    }

    return this.http.get(`${this.baseUrl}/api/Attendance`, { params });
  }

  getCurrentAttendance() {
    return this.http.get(`${this.baseUrl}/api/Attendance/currentAttendance`);
  }

  exportExcel(inputFilter?: any): Observable<Blob> {
    let params = new HttpParams();

    if (inputFilter) {
      Object.keys(inputFilter).forEach((key) => {
        if (inputFilter[key] !== '' && inputFilter[key] !== null) {
          params = params.set(key, inputFilter[key]);
        }
      });
    }
    return this.http
      .get(`${this.baseUrl}/api/Downloads/download-excel-Attendance`, {
        params,
        responseType: 'blob',
      })
      .pipe(
        map((response) => {
          if (!response) {
            throw new Error('No data received');
          }
          return response as Blob;
        })
      );
  }

  downloadPdf() {
    return this.http.get(`${this.baseUrl}/api/Downloads/download-pdf`, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  checkIn() {
    return this.http.post(`${this.baseUrl}/api/Attendance/check-in`, null);
  }
  checkOut(attendanceId: number) {
    return this.http.post(`${this.baseUrl}/api/Attendance/check-out`, {
      attendanceId,
    });
  }
}
