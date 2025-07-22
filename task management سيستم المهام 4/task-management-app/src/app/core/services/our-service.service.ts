import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class OurServiceService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  create(request: any) {
    return this.http.post(`${this.baseUrl}/api/ServiceRequests`, request);
  }
}
