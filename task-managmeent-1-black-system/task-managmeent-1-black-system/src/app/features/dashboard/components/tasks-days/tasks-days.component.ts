import { Component, inject } from '@angular/core';
import Chart from 'chart.js/auto';
import { StatisticsService } from '../../../../core/services/statistics.service';

@Component({
  selector: 'app-tasks-days',
  standalone: true,
  imports: [],
  templateUrl: './tasks-days.component.html',
  styleUrl: './tasks-days.component.scss',
})
export class TasksDaysComponent {
  statisticsService = inject(StatisticsService);

  title = 'days-tasks';
  chart: any = null;

  ngOnInit() {
    this.loadChartData();
  }
  currentRole = localStorage.getItem('role') ?? '';
  private loadChartData() {
    if (this.currentRole == 'Employee') {
      this.statisticsService.getTasksDaysChart().subscribe(
        (response: any) => {
          const daysLabels = response.days.map((day: any) =>
            day.day.toString()
          );
          const finishedTasksData = response.days.map(
            (day: any) => day.finishedTasks
          );
          const completedTasksData = response.days.map(
            (day: any) => day.completedTasks
          );
          const inProgressTasksData = response.days.map(
            (day: any) => day.inProgressTasks
          );

          this.renderChart(
            daysLabels,
            finishedTasksData,
            completedTasksData,
            inProgressTasksData
          );
        },
        (error) => {
          console.error('Failed to load chart data:', error);
        }
      );
    } else {
      this.statisticsService.getTasksDaysChartTents().subscribe(
        (response: any) => {
          const daysLabels = response.map((day: any) => day.day.toString());
          const finishedTasksData = response.map(
            (day: any) => day.finishedTasks
          );
          const completedTasksData = response.map(
            (day: any) => day.completedTasks
          );
          const inProgressTasksData = response.map(
            (day: any) => day.inProgressTasks
          );

          this.renderChart(
            daysLabels,
            finishedTasksData,
            completedTasksData,
            inProgressTasksData
          );
        },
        (error) => {
          console.error('Failed to load chart data:', error);
        }
      );
    }
  }

  private renderChart(
    labels: string[],
    finishedTasks: number[],
    completedTasks: number[],
    inProgressTasks: number[]
  ) {
    if (this.chart) {
      this.chart.destroy(); // Destroy existing chart instance to prevent duplication
    }

    this.chart = new Chart('canvas3', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'المهام المكتمله',
            data: completedTasks,
            backgroundColor: '#9BD0F5',
          },
          {
            label: 'المهام المنتهي',
            data: finishedTasks,
            backgroundColor: '#de6868',
          },
          {
            label: 'المهام الفعاله',
            data: inProgressTasks,
            backgroundColor: '#9fd69f',
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
