import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getList() {
    return this.http.get(`${this.baseUrl}/api/JobApplications`);
  }

  getById(id: string) {
    return this.http.get(`${this.baseUrl}/api/JobApplications/${id}`);
  }
}
