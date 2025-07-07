import {
  Component,
  inject,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import Chart from 'chart.js/auto';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { Knob } from 'primeng/knob';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { EmployeeService } from '../../../../core/services/employee';
import { TasksClassificationComponent } from '../tasks-classification/tasks-classification.component';

@Component({
  selector: 'app-stat-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, Knob, DropdownModule],
  templateUrl: './stat-employees.component.html',
  styleUrls: ['./stat-employees.component.scss'],
})
export class StatEmployeesComponent implements OnInit, OnChanges {
  @Input() tanentId: string = ''; // Receive tenantId from the parent component
  statisticsService = inject(StatisticsService);
  employeesService = inject(EmployeeService);
  title = 'Task Over Year';
  chart: any = null; // Store the Chart instance
  employees: any = [];
  employeeId: string = '';
  completionPercent = 0;
  employeePerformance: any;
  allTask = 0;

  ngOnInit() {
    this.getLookup();
    this.getEmployeePerformance();
  }

  // React to changes in tanentId
  ngOnChanges(changes: SimpleChanges) {
    if (changes['tanentId'] && !changes['tanentId'].firstChange) {
      this.getLookup(); // Update employees list
      this.getEmployeePerformance(); // Update chart data
    }
  }

  updateFilters(event: any) {
    this.employeeId = event.value;
    this.getEmployeePerformance();
  }

  getLookup() {
    this.employeesService.getEmployeesbyTanentId(this.tanentId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.employees = res.data;
      },
      error: (error) => console.log(error),
    });
  }

  getEmployeePerformance() {
    this.statisticsService.getEmployeePerformance(this.employeeId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.loadChartData(res);
      },
      error: (e) => console.log(e),
    });
  }

  loadChartData(response: any) {
    this.allTask = response.All;
    const myData = [
      response.New,
      response.InProgress,
      response.Completed,
      response.Overdue,
    ];

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Create new chart
    const ctx = document.getElementById('canvasEmployees') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'New Tasks',
          'In Progress Tasks',
          'Completed Tasks',
          'Overdue Tasks',
        ],
        datasets: [
          {
            label: 'Task Count',
            data: myData,
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
  }
}
