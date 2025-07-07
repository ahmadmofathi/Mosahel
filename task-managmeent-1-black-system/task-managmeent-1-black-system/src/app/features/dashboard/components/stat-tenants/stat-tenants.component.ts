import { Component, OnInit, OnDestroy, model } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { Chart } from 'chart.js/auto';
import { Knob } from 'primeng/knob';
import { DropdownModule } from 'primeng/dropdown';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { TenantsService } from '../../../../core/services/tenants';
import { EmployeeService } from '../../../../core/services/employee';

@Component({
  selector: 'app-stat-tenants',
  standalone: true,
  imports: [CommonModule, FormsModule, Knob, DropdownModule],
  providers: [TenantsService],
  templateUrl: './stat-tenants.component.html',
  styleUrls: ['./stat-tenants.component.scss'],
})
export class StatTenantsComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  tenants: any[] = [];
  employees: any;
  tenantId: string | null = null;
  employeeId: string = '';
  tenantPerformance: any;
  completionPercent = 0;
  EcompletionPercent = 0;
  allTask = 0;
  EallTask = 0;
  Tchart: Chart | null = null;
  Echart: Chart | null = null;
  date = model([]);

  constructor(
    private statisticsService: StatisticsService,
    private tenantsService: TenantsService,
    private employeesService: EmployeeService
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.destroyCharts();
  }

  loadInitialData() {
    this.subscriptions.add(
      this.tenantsService.getList({ pageSize: 1000 }).subscribe((res: any) => {
        this.tenants = res.data;
        if (this.tenants.length > 0) {
          this.tenantId = this.tenants[0].id;
          this.loadTenantData();
        }
      })
    );
  }

  loadTenantData() {
    if (!this.tenantId) return;
    let endDate: any = this.date()[1] ?? new Date();
    endDate = formatDate(endDate, 'yyyy-MM-dd', 'en-US');
    const params = {
      startDate: this.date()[0]
        ? formatDate(this.date()[0], 'yyyy-MM-dd', 'en-US')
        : null,
      endDate: endDate,
    };

    const tenantPerformance$ =
      this.statisticsService.getEmployeePerformanceByTenant(
        this.tenantId,
        params
      );

    const tasksCount$ = this.statisticsService.getTasksCountByTent(
      this.tenantId,
      params
    );

    const employees$ = this.employeesService.getEmployeesbyTanentId(
      this.tenantId
    );

    this.subscriptions.add(
      forkJoin([tenantPerformance$, tasksCount$, employees$]).subscribe({
        next: ([performanceRes, tasksRes, employeesRes]) => {
          console.log(performanceRes, tasksRes, employeesRes);
          this.updateTenantPerformance(performanceRes);
          this.updateTasksCount(tasksRes);
          this.employees = employeesRes;
          if (this.employees.length > 0) {
            this.employeeId = this.employees[0].id;
            this.loadEmployeeData();
          }
          this.createChart('canvasTenants', tasksRes, 'Tchart');
        },
        error: (error) => console.error('Error loading tenant data:', error),
      })
    );
  }

  updateTenantPerformance(res: any) {
    this.tenantPerformance = res.performancePercentage;
    this.completionPercent = this.tenantPerformance?.overallPerformance || 0;
  }

  updateTasksCount(res: any) {
    this.allTask = res.All;
  }

  onTenantChange(event: any) {
    this.tenantId = event.value;
    this.loadTenantData();
  }

  onEmployeeChange(event: any) {
    this.employeeId = event.value;
    this.loadEmployeeData();
  }

  loadEmployeeData() {
    if (!this.employeeId) return;

    this.subscriptions.add(
      this.statisticsService.getEmployeePerformance(this.employeeId).subscribe({
        next: (res: any) => {
          console.log(res);
          this.updateEmployeeChart(res);
        },
        error: (error) =>
          console.error('Error fetching employee performance:', error),
      })
    );
  }

  updateEmployeeChart(data: any) {
    console.log(data);
    this.EallTask = data.totalTasks;
    this.EcompletionPercent = data.overallPerformance || 0;
    this.createChart('canvasEmployees', data, 'Echart');
  }

  createChart(elementId: string, data: any, chartType: 'Tchart' | 'Echart') {
    const ctx = document.getElementById(elementId) as HTMLCanvasElement;
    if (!ctx) return;

    if (this[chartType]) {
      this[chartType]?.destroy();
    }

    const myData =
      chartType === 'Echart'
        ? [data.notStarted, data.inProgress, data.completed, data.delayed]
        : [data.New, data.InProgress, data.Completed, data.Overdue];

    const labels = [
      'مجموع لم تبدأ',
      'مجموع جاري العمل عليها',
      'مجموع المكتمله',
      'مجموع المتأخره',
    ];
    const colors = [
      'rgba(255, 99, 132, 0.5)',
      'rgba(255, 159, 64, 0.5)',
      'rgba(255, 205, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
    ];

    this[chartType] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          // I do not want to be a label
          {
            label: '',
            data: myData,
            backgroundColor: colors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
        plugins: {
          legend: { display: false}
        }
      },
    });
  }

  private destroyCharts() {
    if (this.Tchart) this.Tchart.destroy();
    if (this.Echart) this.Echart.destroy();
  }
}
