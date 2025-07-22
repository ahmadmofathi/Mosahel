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
  getEmployeePerformanceByTenant(tenantId: any) {
    return this.http.get(
      `${this.baseUrl}/api/Statistics/employee-performanceByTenant/${tenantId}`
    );
  }
  getEmployeeTaskStats(employeeId: any) {
    return this.http.get(
      `${this.baseUrl}/api/Statistics/employee-task-statistics/${employeeId}`
    );
  }
  // /api/Statistics/tasks-status-count-ByTenant/{tenantId}
  getTasksCountByTent(tenantId: any) {
    return this.http.get(
      `${this.baseUrl}/api/Statistics/tasks-status-count-ByTenant/${tenantId}`
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
}
