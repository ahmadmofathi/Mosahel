import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import Chart from 'chart.js/auto';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { Knob } from 'primeng/knob';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TenantsService } from '../../../../core/services/tenants';
import { DropdownModule } from 'primeng/dropdown';
import { EmployeeService } from '../../../../core/services/employee';
import { Router } from '@angular/router';
import { ServiceRequestService } from '../../../../core/services/service-request';
import { JobApplicationService } from '../../../../core/services/job-application';

@Component({
  selector: 'app-stat-tenants',
  standalone: true,
  imports: [CommonModule, FormsModule, Knob, DropdownModule],
  providers: [TenantsService],
  templateUrl: './stat-tenants.component.html',
  styleUrl: './stat-tenants.component.scss',
})
export class StatTenantsComponent {
  statisticsService = inject(StatisticsService);
  tenantsService = inject(TenantsService);
  employeesService = inject(EmployeeService);
  serviceRequestService = inject(ServiceRequestService);
  jobApplicationService = inject(JobApplicationService);
  router =inject(Router);
  title = 'task over year';
  chart: any = [];
  tenants: any = [];
  completionPercent = 0;
  @Output() subscriptionLeftChange = new EventEmitter<number>();
  subscriptionLeft =0;
  getLookup() {
    this.tenantsService.getList({ pageSize: 1000 }).subscribe((res: any) => {
      this.tenants = res.data;
      if (this.tenants.length > 0) {
        const expirationDate = new Date(this.tenants[0].expirationDate); // Convert to Date object
        const today = new Date();
  
        // Ensure both dates are in YYYY-MM-DD format (ignoring time)
        expirationDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
  
        // Calculate days left
        this.subscriptionLeft = Math.ceil(
          (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        this.subscriptionLeftChange.emit(this.subscriptionLeft);
        // console.log(`Subscription days left: ${this.subscriptionLeft}`);
        this.tenantId = this.tenants[0]?.id;
        this.getTeneantsPerformance();
        this.loadChartData();
        this.fillEmployees();
      }
    });
  }
  tenantPerformance: any;
  getTeneantsPerformance() {
    console.log('id tenant',this.tenantId)
    this.statisticsService
      .getEmployeePerformanceByTenant(
        this.tenantId ? this.tenantId : this.tenants[0]?.id
      )
      .subscribe((res: any) => {
        console.log(res);
        this.tenantPerformance = res.performancePercentage;
        this.completionPercent = this.tenantPerformance.tasksCompletionPercentage;
      });
  }
  getEmployeeTaskPerformance() {
    this.statisticsService
      .getEmpPerformance(
        this.employeeId
      )
      .subscribe((res: any) => {
        console.log(res);
        this.tenantPerformance = res.performancePercentage;
        this.completionPercent = res.Completed / res.All;
      });
  }
  getExpiration(){
    // this.tenantsService.getTenantExpiration().subscribe((res: any) => {
    //   console.log(res);
    // })
  }
  updateFilters(event: any,mode:any) {
    mode=='t'?this.tenantId = event.value:this.employeeId = event.value;
    // this.fillEmployees();
    console.log(this.employeeId)
    if(this.employeeId){
      this.getEmployeeTaskPerformance();
      this.loadEmployeeChartData();
    }else{
      this.getTeneantsPerformance();
      this.loadChartData();
    }
  }

  tenantId: any = null;
  employeeId: any = null;
  employments:any =[];
  serviceReqs:any =[];
  employmentNum = 0;
  serviceRequestNum = 0;
  ngOnInit(): void {
    this.serviceRequestService.getList().subscribe((res) => {
      console.log(res);
      this.serviceReqs = res;
      this.serviceRequestNum = this.serviceReqs.length;
    });
    this.jobApplicationService.getList().subscribe((res) => {
      console.log(res);
      this.employments = res;
      this.employmentNum = this.employments.length;
    })
    this.getLookup();
    // this.loadChartData();
    this.getExpiration();
  }

  tenantsEmployees: any = [];
  fillEmployees(){
    this.employeeId=null;
    this.employeesService.getEmployeesbyTanentId(this.tenantId).subscribe((res: any) => {
      this.tenantsEmployees = res;
      console.log(res)
    })
  }

  allTask = 0;
  loadChartData() {
    this.statisticsService
      .getTasksCountByTent(this.tenantId ? this.tenantId : this.tenants[0]?.id)
      .subscribe((response: any) => {
        console.log(response);
        this.allTask = response.All;
        const myData = [
          response.New,
          response.InProgress,
          response.Completed,
          response.Overdue,
        ];
        console.log(myData)
        console.log(this.chart);
        this.chart?.id? this.chart.destroy():null;
        this.chart = new Chart('canvasTenants', {
          type: 'bar',
          data: {
            labels: [
              'مجموع المهام الجديدة',
              'مجموع جارى العمل',
              'مجموع المكتملة',
              'مجموع المتأخره',
            ],
            datasets: [
              {
                label: 'إحصائيات المهام',
                data: [
                  response.New,
                  response.InProgress,
                  response.Completed,
                  response.Overdue,
                ],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.5)',
                  'rgba(255, 159, 64, 0.5)',
                  'rgba(255, 205, 86, 0.5)',
                  'rgba(75, 192, 192, 0.5)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
  }
  loadEmployeeChartData() {
    this.statisticsService
      .getEmployeeTaskStats(this.employeeId)
      .subscribe((response: any) => {
        console.log(response);
        this.allTask = response.totalTasks;
        const myData = [
          response.notStarted,
          response.inProgress,
          response.completed,
          response.delayed,
        ];
        this.completionPercent = response.completionRate;
        console.log(this.chart);
        this.chart?.id? this.chart.destroy():null;
        this.chart = new Chart('canvasTenants', {
          type: 'bar',
          data: {
            labels: [
              'مجموع المهام الجديدة',
              'مجموع جارى العمل',
              'مجموع المكتملة',
              'مجموع المتأخره',
            ],
            datasets: [
              {
                label: 'إحصائيات المهام',
                data: [
                  response.notStarted,
                  response.inProgress,
                  response.completed,
                  response.delayed,
                ],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.5)',
                  'rgba(255, 159, 64, 0.5)',
                  'rgba(255, 205, 86, 0.5)',
                  'rgba(75, 192, 192, 0.5)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
  }
  employment(){
    this.router.navigate(['/employment']);
  }
  serviceRequest(){
    this.router.navigate(['/service-request']);
  }
}
