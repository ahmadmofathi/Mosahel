import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { createFormDataMultiFiles } from '../../../shared/utils/formdata';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
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

    return this.http.get(`${this.baseUrl}/exercises`, { params });
  }

  getById(id: string) {
    return this.http.get(`${this.baseUrl}/exercises/${id}`);
  }

  create(task: any) {
    return this.http.post(
      `${this.baseUrl}/exercises`,
      createFormDataMultiFiles(task)
    );
  }
  reactTrain(id: any) {
    return this.http.post(`${this.baseUrl}/Reactions`, {
      exerciseId: id,
      reactId: 1,
    });
  }

  update(id: string, task: any) {
    return this.http.put(
      `${this.baseUrl}/exercises/${id}`,
      createFormDataMultiFiles(task)
    );
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/exercises/${id}`);
  }
}
