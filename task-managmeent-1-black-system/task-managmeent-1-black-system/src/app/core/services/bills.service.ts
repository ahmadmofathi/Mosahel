import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  // base url
  api = `${environment.apiUrl}/api/Invoices`;

  // Constructor
  constructor(private http: HttpClient) {}

  // get all bills
  getBills(inputFilter: any): Observable<any> {
    let params = new HttpParams();

    // Add parameters dynamically if `inputFilter` is provided
    if (inputFilter) {
      Object.keys(inputFilter).forEach((key) => {
        if (inputFilter[key] !== '' && inputFilter[key] !== null) {
          params = params.set(key, inputFilter[key]);
        }
      });
    }
    return this.http.get(`${this.api}/GetAllInvoices`, { params });
  }

  // add bill to the list
  addBill(id: number, amount: number): Observable<any> {
    return this.http.post(
      `${this.api}/CreateInvoice?contractId=${id}&amountPaid=${amount}`,
      {}
    );
  }

  // remove bill from the list by id
  removeBill(id: number): Observable<any> {
    return this.http.delete(`${this.api}/DeleteInvoice/${id}`);
  }

  // update bill by id
  updateBill(id: number, amount: number): Observable<any> {
    return this.http.put(
      `${this.api}/UpdateInvoice?invoiceId=${id}&newAmountPaid=${amount}`,
      {}
    );
  }

  // get bill by id
  getBillOfContract(id: number) {
    return this.http.get(`${this.api}/GetInvoiceByContract/${id}`);
  }
}
