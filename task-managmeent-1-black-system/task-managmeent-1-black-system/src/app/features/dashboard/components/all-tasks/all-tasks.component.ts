import { Component, effect, inject, model } from '@angular/core';
// import Chart from 'chart.js/auto';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { formatDate } from '@angular/common';
import { Knob } from 'primeng/knob';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [Knob, CommonModule, FormsModule],
  templateUrl: './all-tasks.component.html',
  styleUrl: './all-tasks.component.scss',
})
export class AllTasksComponent {
  statisticsService = inject(StatisticsService);
  constructor() {
    effect(() => {
      this.fetchTaskData();
    });
  }
  date = model([]);
  chart: any;

  ngOnInit() {}
  isDataEmpty = false;
  completionPercent: number = 0;
  fetchTaskData() {
    let endDate: any = this.date()[1] ?? new Date();
    endDate = formatDate(endDate, 'yyyy-MM-dd', 'en-US');
    this.statisticsService
      .getEmpPerformance({
        startDate: this.date()[0]
          ? formatDate(this.date()[0], 'yyyy-MM-dd', 'en-US')
          : null,
        endDate: endDate,
      })
      .subscribe({
        next: (data: any) => {
          this.completionPercent =
            data.performancePercentage.overallPerformance;
          // const labels = [
          //   'النسبة المخصص للمهام',
          //   'النسبة المخصص للحضور والانصراف',
          //   'النسبة المخصص الاشعارات',
          //   'النسبة المخصص التدريب',
          //   'النسبة المخصص للمجموع',
          // ];
          // const {
          //   tasksCompletionPercentage,
          //   attendancePercentage,
          //   notificationsPercentage,
          //   trainingPercentage,
          //   overallPerformance,
          // } = data.performancePercentage;
          // const chartData = [
          //   tasksCompletionPercentage,
          //   attendancePercentage,
          //   notificationsPercentage,
          //   trainingPercentage,
          //   overallPerformance,
          // ];
          // this.isDataEmpty = chartData.every((value) => value === 0);
          // this.initializeChart(labels, chartData);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        },
      });
  }

  // initializeChart(labels: string[], data: number[]) {
  //   this.chart?.destroy();
  //   this.chart = new Chart('canvasAllTasks', {
  //     type: 'doughnut',
  //     data: {
  //       labels,
  //       datasets: [
  //         {
  //           label: 'Task Summary',
  //           data,
  //           // backgroundColor: ['#FF6384', '#36A2EB'],
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       plugins: {
  //         tooltip: {
  //           callbacks: {
  //             label: (tooltipItem) => {
  //               // Add suffix
  //               const value = tooltipItem.raw; // Raw value
  //               return `% ${value} `; // Suffix 'tasks'
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  // }
}
