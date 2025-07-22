import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getReport(inputFilter?: any) {
    let params = new HttpParams();

    // Add parameters dynamically if `inputFilter` is provided
    if (inputFilter) {
      Object.keys(inputFilter).forEach((key) => {
        if (inputFilter[key] !== '' && inputFilter[key] !== null) {
          params = params.set(key, inputFilter[key]);
        }
      });
    }
    return this.http.get(`${this.baseUrl}/api/reports/employees-report-by-tenant`, { params });
  }
  getTableReport(inputFilter?: any) {
    let params = new HttpParams();

    // Add parameters dynamically if `inputFilter` is provided
    if (inputFilter) {
      Object.keys(inputFilter).forEach((key) => {
        if (inputFilter[key] !== '' && inputFilter[key] !== null) {
          params = params.set(key, inputFilter[key]);
        }
      });
    }
    return this.http.get(`${this.baseUrl}/api/reports/employees-by-tenant`, { params });
  }

  exportExcel(inputFilter?: any): Observable<Blob> {
      let params = new HttpParams();

      // Add parameters dynamically if `inputFilter` is provided
      if (inputFilter) {
        Object.keys(inputFilter).forEach((key) => {
          if (inputFilter[key] !== '' && inputFilter[key] !== null) {
            params = params.set(key, inputFilter[key]);
          }
        });
      }
      return this.http
        .get(`${this.baseUrl}/api/reports/download-employees-reportByTenant`, {
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
}
