import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CrmService {
  // Mock data for customers
  private mockCustomers = [
    {
      id: 1,
      responsibleUser: 'اسماء علي مطير',
      responsibleUserRole: 'مدير',
      phoneNumber: '01223123124',
      mobileNumber: '01223123124',
      email: 'kljgfha2kljlk.cam',
      status: 'فعلي',
      action: 'اتصال هاتفي',
      notes: 'لا يوجد',
    },
    {
      id: 2,
      responsibleUser: 'محمد أحمد',
      responsibleUserRole: 'موظف',
      phoneNumber: '01111111111',
      mobileNumber: '02222222222',
      email: 'mohamed.ahmed@example.com',
      status: 'غير فعلي',
      action: 'إرسال بريد',
      notes: 'يحتاج متابعة',
    },
    {
      id: 3,
      responsibleUser: 'فاطمة خالد',
      responsibleUserRole: 'مدير',
      phoneNumber: '03333333333',
      mobileNumber: '04444444444',
      email: 'fatima.khaled@example.com',
      status: 'فعلي',
      action: 'زيارة موقع',
      notes: 'تم التواصل بنجاح',
    },
  ];

  // base api
  api: string = `${environment.apiUrl}/api/CRMs`;

  constructor(private http: HttpClient) {}

  // Get list of customers with pagination
  getList(inputFilter: any): Observable<any> {
    let params = new HttpParams();

    // Add parameters dynamically if `inputFilter` is provided
    if (inputFilter) {
      Object.keys(inputFilter).forEach((key) => {
        if (inputFilter[key] !== '' && inputFilter[key] !== null) {
          params = params.set(key, inputFilter[key]);
        }
      });
    }
    return this.http.get(`${this.api}`, { params });
  }

  getCustomerById(id: number) {
    return this.http.get(`${this.api}/${id}`);
  }

  // Delete a customer by ID
  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  add(customer: any) {
    return this.http.post(this.api, customer);
  }

  // Export data to Excel (mock implementation)
  exportExcel() {
    // Simulate a file download
    const blob = new Blob([JSON.stringify(this.mockCustomers)], {
      type: 'application/vnd.ms-excel',
    });
    return of(blob);
  }

  update(customer: any) {
    return this.http.put(`${this.api}/${customer.id}`, customer);
  }

  updateStatus(id: number, status: string) {
    const statusDto = {
      status: Number(status)
    };
    console.log(statusDto);
    return this.http.put(`${this.api}/EditStatus/${id}`, statusDto);
  }

updateAction(id: number, action: string) {
    const actionDto = {
      action: Number(action)
    };
    console.log(actionDto);
    return this.http.put(`${this.api}/EditAction/${id}`, actionDto);
  }
}
