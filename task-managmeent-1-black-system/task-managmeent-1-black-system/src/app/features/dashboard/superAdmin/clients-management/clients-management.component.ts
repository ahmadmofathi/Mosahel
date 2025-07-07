import { Component, effect, model, OnInit } from '@angular/core';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { Chart } from 'chart.js';
import { formatDate } from '@angular/common';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';

@Component({
  selector: 'app-clients-management',
  standalone: true,
  imports: [HasRoleDirective],
  templateUrl: './clients-management.component.html',
  styleUrl: './clients-management.component.scss',
})
export class ClientsManagementComponent implements OnInit {
  clientsStatus: any;
  clientsDistribution: any = null;
  clientsPercentage: any = null;

  // Store Chart instances
  barChart: any;
  doughnutChart: any;

  constructor(private statService: StatisticsService) {}

  ngOnInit(): void {
    this.getClientsData(); // Fetch data when the component initializes
  }

  getClientsData() {
    this.statService.getClientsStatus().subscribe({
      next: (res: any) => {
        this.clientsStatus = res.reduce(
          (acc: any, s: any) => {
            acc[s.status] = s.count;
            return acc;
          },
          { All: 0 }
        );
        this.statService.getClientsPercentage().subscribe({
          next: (res: any) => {
            console.log('clients percentage: ', res);
            this.clientsStatus.All = res.totalClients;
            this.renderDoughnutChart(res); // Render the Doughnut Chart
          },
          error: (error) => {
            console.log('clients percentage error: ', error);
          },
        });
      },
      error: (error) => {
        console.log('clients status error: ', error);
      },
    });

    this.statService.getClientDistribution().subscribe({
      next: (res: any) => {
        console.log('chart data: ', res);
        this.renderBarChart(res); // Render the Bar Chart
      },
      error: (error) => {
        console.log('clients distribution error: ', error);
      },
    });
  }

  renderBarChart(data: any) {
    // Destroy existing bar chart if it exists
    if (this.barChart) {
      this.barChart.destroy();
    }

    console.log('hager', data);

    // Transform the API data into arrays for the chart
    const Active = Object.values(data).map(
      (month) => (month as any).status === 'Active'
    );
    const Potential = Object.values(data).map(
      (month) => (month as any).status === 'Potential'
    );
    const Hesitant = Object.values(data).map(
      (month) => (month as any).status === 'Hesitant'
    );
    const NotInterested = Object.values(data).map(
      (month) => (month as any).status === 'NotInterested'
    );

    // Create new bar chart
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    this.barChart = new Chart(ctx, {
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
            label: 'مجموع العملاء الغير مهتمين',
            data: NotInterested,
            borderWidth: 1,
          },
          {
            label: 'مجموع عملاء المترددين',
            data: Hesitant,
            borderWidth: 1,
          },
          {
            label: 'مجموع العملاء الفعليين  ',
            data: Active,
            borderWidth: 1,
          },
          {
            label: 'مجموع العملاء المحتملين',
            data: Potential,
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

  renderDoughnutChart(data: any) {
    // Destroy existing doughnut chart if it exists
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
    }

    // Create new doughnut chart
    const ctx = document.getElementById('doughnutChart') as HTMLCanvasElement;
    this.doughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['العملاء الفعليين', 'مجموع العملاء'],
        datasets: [
          {
            label: 'العملاء',
            data: [data.activeClients, data.totalClients - data.activeClients],
            backgroundColor: [
              'rgba(54, 162, 235, 0.8)', // Blue for active clients
              'rgba(255, 99, 132, 0.8)', // Red for inactive clients
            ],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.raw) {
                  label += context.raw + 'العملاء';
                }
                return label;
              },
            },
          },
        },
      },
    });
  }
}
