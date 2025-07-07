import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TaskDto } from './models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
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
      .get(`${this.baseUrl}/api/Downloads/download-excel-TaskItems`, {
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

  updateCompletionPercentage(task: any) {
    return this.http.put(
      `${this.baseUrl}/api/TaskItems/updateCompletionPercentage`,
      task
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

  // Download
  downloadTask(task: any){
    // return this.http.get(`${this.baseUrl}/api/Downloads/download-task-file/${task.taskId}`, {responseType: 'blob'});
  }
}
