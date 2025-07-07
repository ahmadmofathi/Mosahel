import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getStatsTent() {
    return this.http.get(`${this.baseUrl}/api/TenantStatistics/statistics`);
  }

  getStatsEmp() {
    return this.http.get(
      `${this.baseUrl}/api/Statistics/tasks-status-current-month`
    );
  }

  // /api/TenantStatistics/statistics
  getTasksDaysChartTents() {
    return this.http.get(`${this.baseUrl}/api/TenantStatistics/current-month`);
  }

  getTasksDaysChart() {
    return this.http.get(`${this.baseUrl}/api/Statistics/tasks-status-by-day`);
  }
  getTasksCountSuper() {
    return this.http.get(`${this.baseUrl}/api/Statistics/tasks-status-count`);
  }

  // /api/Statistics/statusesOverYear

  getStatsOverYear() {
    return this.http.get(`${this.baseUrl}/api/Statistics/statusesOverYear`);
  }

  // /api/Statistics/employee-performanceByTenant/{tenantId}
  getEmployeePerformanceByTenant(tenantId: any, inputFilter?: any) {
    let params = new HttpParams();

    // Add parameters dynamically if `inputFilter` is provided
    if (inputFilter) {
      Object.keys(inputFilter).forEach((key) => {
        if (inputFilter[key] !== '' && inputFilter[key] !== null) {
          params = params.set(key, inputFilter[key]);
        }
      });
    }
    return this.http.get(
      `${this.baseUrl}/api/Statistics/employee-performanceByTenant/${tenantId}`,
      { params }
    );
  }
  // /api/Statistics/tasks-status-count-ByTenant/{tenantId}
  getTasksCountByTent(tenantId: any, inputFilter?: any) {
    let params = new HttpParams();

    // Add parameters dynamically if `inputFilter` is provided
    if (inputFilter) {
      Object.keys(inputFilter).forEach((key) => {
        if (inputFilter[key] !== '' && inputFilter[key] !== null) {
          params = params.set(key, inputFilter[key]);
        }
      });
    }
    return this.http.get(
      `${this.baseUrl}/api/Statistics/tasks-status-count-ByTenant/${tenantId}`,
      { params }
    );
  }

  getEmployeePerformance(id: string) {
    return this.http.get(
      `${this.baseUrl}/api/Statistics/employee-task-statistics/${id}`
    );
  }

  getEmpPerformance(inputFilter?: any) {
    let params = new HttpParams();

    // Add parameters dynamically if `inputFilter` is provided
    if (inputFilter) {
      Object.keys(inputFilter).forEach((key) => {
        if (inputFilter[key] !== '' && inputFilter[key] !== null) {
          params = params.set(key, inputFilter[key]);
        }
      });
    }
    return this.http.get(
      `${this.baseUrl}/api/Statistics/employee-performance`,
      { params }
    );
  }

  api: string = `${this.baseUrl}/api/Statistics/`;
  // todo: Customers managment
  getClientsStatus() {
    return this.http.get(this.api + 'clients-status-summary');
  }

  getClientDistribution() {
    return this.http.get(this.api + 'clients-distribution-by-month');
  }

  getClientsPercentage() {
    return this.http.get(this.api + 'clients-percentage');
  }

  // ______________________ Sales Management _____________________//
  getSalesDash() {
    return this.http.get(this.api + 'sales-dashboard');
  }

  updateTarget(t: number) {
    return this.http.post(this.api + 'update-target', {
      newTargetAmount: t,
    });
  }

  //_______________________ Contracts Statistics ___________________//
  getContractStatus() {
    return this.http.get(this.api + 'contracts');
  }
}
