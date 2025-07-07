import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DealsService {
  api: string = `${environment.apiUrl}/api/Contracts/`;

  constructor(private http: HttpClient) {}

  // get all deals
  getDeals(inputFilter?: any) {
    let params = new HttpParams();

    // Add parameters dynamically if `inputFilter` is provided
    if (inputFilter) {
      Object.keys(inputFilter).forEach((key) => {
        if (inputFilter[key] !== '' && inputFilter[key] !== null) {
          params = params.set(key, inputFilter[key]);
        }
      });
    }
    return this.http.get(this.api, { params });
  }

  // get deal
  getDeal(id: string): Observable<any> {
    return this.http.get(this.api + id);
  }

  // get deals by tenant id
  getDealsByTenantId(tenantId: string) {
    return this.http.get(
      this.api + 'GetAllContractsByTenantId?tenantId=' + tenantId
    );
  }

  // update deal
  updateDeal(deal: any): Observable<any> {
    return this.http.put(this.api + deal.id, deal);
  }

  // update deal status
  updateDealStatus(deal: any): Observable<any> {
    console.log(deal);
    return this.http.put(
      this.api + 'ChangeStatus/' + deal.id,
      {
        status: deal.status,
      }
    );
  }

  // add deal
  addDeal(deal: any): Observable<any> {
    return this.http.post(this.api, deal);
  }

  // delete deal
  deleteDeal(id: number): Observable<any> {
    console.log(id);
    return this.http.delete(this.api + id);
  }
}
