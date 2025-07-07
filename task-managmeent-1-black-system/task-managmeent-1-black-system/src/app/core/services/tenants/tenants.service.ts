import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TenantsService {
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
    return this.http.get(`${this.baseUrl}/Tenants`, { params });
  }

  getById(id: string) {
    return this.http.get(`${this.baseUrl}/Tenants/${id}`);
  }

  create(tenant: any) {
    return this.http.post(`${this.baseUrl}/Auth/register-company`, tenant);
  }

  update(id: string, tenant: any) {
    return this.http.put(`${this.baseUrl}/Tenants/${id}`, tenant);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/Tenants/${id}`);
  }
}
