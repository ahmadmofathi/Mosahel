import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TaskDto } from './models';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getList(inputFilter?: any) {
    let params = new HttpParams();

    if (inputFilter) {
      Object.keys(inputFilter).forEach((key) => {
        if (inputFilter[key] !== '' && inputFilter[key] !== null) {
          params = params.set(key, inputFilter[key]);
        }
      });
    }

    return this.http.get(`${this.baseUrl}/api/TaskItems`, { params });
  }

  getTasksForCurrentEmployee() {
    return this.http.get(
      `${this.baseUrl}/api/TaskItems/GetTasksForCurrentEmployee`
    );
  }

  getById(id: string) {
    return this.http.get(`${this.baseUrl}/api/TaskItems/${id}`);
  }
  startTask(id: string) {
    return this.http.put(`${this.baseUrl}/api/TaskItems/start/${id}`, null);
  }
  completeTask(id: string) {
    return this.http.put(`${this.baseUrl}/api/TaskItems/complete/${id}`, null);
  }

  create(task: TaskDto) {
    return this.http.post(`${this.baseUrl}/api/TaskItems`, task);
  }

  update(id: string, task: TaskDto) {
    return this.http.put(`${this.baseUrl}/api/TaskItems/${id}`, task);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/api/TaskItems/${id}`);
  }
}
