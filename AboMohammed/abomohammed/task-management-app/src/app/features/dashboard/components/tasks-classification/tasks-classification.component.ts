import { Component, inject, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { StatisticsService } from '../../../../core/services/statistics.service';

@Component({
  selector: 'app-tasks-classification',
  standalone: true,
  imports: [],
  templateUrl: './tasks-classification.component.html',
  styleUrl: './tasks-classification.component.scss',
})
export class TasksClassificationComponent implements OnInit {
  statisticsService = inject(StatisticsService);
  title = 'task over year';
  chart: any = [];

  ngOnInit() {
    this.loadChartData();
  }

  loadChartData() {
    this.statisticsService.getStatsOverYear().subscribe((response: any) => {
      // Transform the API data into arrays for the chart
      const newTasks = Object.values(response).map(
        (month) => (month as any).New
      );
      const inProgressTasks = Object.values(response).map(
        (month) => (month as any).InProgress
      );
      const completedTasks = Object.values(response).map(
        (month) => (month as any).Completed
      );
      const overdueTasks = Object.values(response).map(
        (month) => (month as any).Overdue
      );

      this.chart = new Chart('canvas01', {
        type: 'bar',
        data: {
          labels: [
            'يناير',
            'فبراير',
            'مارس',
            'أبريل',
            'مايو',
            'يونيو',
            'يوليو',
            'أغسطس',
            'سبتمبر',
            'أكتوبر',
            'نوفمبر',
            'ديسمبر',
          ],
          datasets: [
            {
              label: 'مجموع المتأخره',
              data: overdueTasks,
              borderWidth: 1,
            },
            {
              label: 'مجموع المكتمة',
              data: completedTasks,
              borderWidth: 1,
            },
            {
              label: 'مجموع جاري العمل',
              data: inProgressTasks,
              borderWidth: 1,
            },
            {
              label: 'مجموع المهام الجديدة',
              data: newTasks,
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
}
