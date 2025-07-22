import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { createFormDataMultiFiles } from '../../shared/utils/formdata';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  create(job: any) {
    return this.http.post(
      `${this.baseUrl}/api/JobApplications`,
      createFormDataMultiFiles(job)
    );
  }
}
