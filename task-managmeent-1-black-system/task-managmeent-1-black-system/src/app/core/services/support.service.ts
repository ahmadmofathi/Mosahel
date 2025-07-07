import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  // Base url
  api: string = `${environment.apiUrl}/api/support`;

  constructor(private http: HttpClient) {}

  getSupportRequests(inputFilter?: any) {
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

  reply(id: string, message: string): Observable<any> {
    // return this.http.post('https://localhost:5001/api/SupportRequests/reply', {
    //   id,
    //   message,
    // });
    console.log(id, message);
    return of(true);
  }

  // add
  askForSupport(formData: any): Observable<any> {
    return this.http.post(this.api, { ...formData, issueType: 2 });
  }
}
