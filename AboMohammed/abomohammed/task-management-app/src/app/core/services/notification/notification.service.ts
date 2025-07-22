import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
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
    return this.http.get(`${this.baseUrl}/api/Notifications`, { params });
  }

  getById(id: string) {
    return this.http.get(`${this.baseUrl}/Tenants/${id}`);
  }
  // /api/Notifications/react/{notificationId}

  react(id: any) {
    return this.http.post(`${this.baseUrl}/api/Notifications/react/${id}`, id);
  }

  create(tenant: any) {
    return this.http.post(`${this.baseUrl}/api/Notifications`, tenant);
  }

  // /api/Notifications/latestNotification
  getLatest() {
    return this.http.get(
      `${this.baseUrl}/api/Notifications/latestNotification`
    );
  }

  update(id: string, tenant: any) {
    return this.http.put(`${this.baseUrl}/api/Notifications/${id}`, tenant);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/api/Notifications/${id}`);
  }
}
