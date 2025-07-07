import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ValiditiesService {
  // Base url
  api: string = `${environment.apiUrl}/api/User`;

  // Constructor
  constructor(private http: HttpClient) {}

  // get all employees
  getEmployees(inputFilter?: any) {
    let params = new HttpParams();

    // Add parameters dynamically if `inputFilter` is provided
    if (inputFilter) {
      Object.keys(inputFilter).forEach((key) => {
        if (inputFilter[key] !== '' && inputFilter[key] !== null) {
          params = params.set(key, inputFilter[key]);
        }
      });
    }
    return this.http.get(`${this.api}/GetAll`, { params });
  }
  getUsersByRole(inputFilter?: any) {
    let params = new HttpParams();

    // Add parameters dynamically if `inputFilter` is provided
    if (inputFilter) {
      Object.keys(inputFilter).forEach((key) => {
        if (inputFilter[key] !== '' && inputFilter[key] !== null) {
          params = params.set(key, inputFilter[key]);
        }
      });
    }
    return this.http.get(`${this.api}/GetUsersByRole`, { params });
  }

  // get employee
  getEmployee(id: number) {
    return this.http.get(`${this.api}/Get/${id}`);
  }

  //add employee
  addEmployee(employee: any) {
    return this.http.post(`${this.api}/Create`, employee);
  }

  // update employee
  updateEmployee(id: number, employee: any) {
    return this.http.put(`${this.api}/Update/${id}`, employee);
  }

  // delete employee
  deleteEmployee(id: number) {
    return this.http.delete(`${this.api}/Delete/${id}`);
  }
}
