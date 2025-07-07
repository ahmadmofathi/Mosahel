import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { createFormDataMultiFiles } from '../../../shared/utils/formdata';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
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

    return this.http.get(`${this.baseUrl}/api/TasksFiles/files`, { params });
  }

  getById(id: string) {
    return this.http.get(`${this.baseUrl}/Employees/${id}`);
  }

  create(task: any) {
    return this.http.post(
      `${this.baseUrl}/api/TasksFiles/upload`,
      createFormDataMultiFiles(task)
    );
  }

  update(id: string, task: any) {
    return this.http.put(
      `${this.baseUrl}/api/TasksFiles/update/${id}`,
      createFormDataMultiFiles(task)
    );
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/api/TasksFiles/${id}`);
  }
}
