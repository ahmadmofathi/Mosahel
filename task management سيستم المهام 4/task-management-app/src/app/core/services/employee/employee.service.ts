import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TaskDto } from './models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
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

    return this.http.get(`${this.baseUrl}/Employees`, { params });
  }

  getById(id: string) {
    return this.http.get(`${this.baseUrl}/Employees/${id}`);
  }
  exportExcel(): Observable<Blob> {
    return this.http
      .get(`${this.baseUrl}/api/Downloads/download-excel-Employee`, {
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
  getEmployeesbyTanentId(id: string) {
    return this.http.get(
      `${this.baseUrl}/Employees/GetEmployeesBasedOnTenantIdAsync/${id}`
    );
  }

  create(task: TaskDto) {
    return this.http.post(`${this.baseUrl}/Employees`, task);
  }

  update(id: string, task: TaskDto) {
    return this.http.put(`${this.baseUrl}/Employees/${id}`, task);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/Employees/${id}`);
  }
}
