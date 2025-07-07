import { Component } from '@angular/core';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { Chart } from 'chart.js';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';

@Component({
  selector: 'app-stat-contracts',
  standalone: true,
  imports: [HasRoleDirective],
  templateUrl: './stat-contracts.component.html',
  styleUrl: './stat-contracts.component.scss',
})
export class StatContractsComponent {
  data: any;
  chart: any;

  constructor(private stat: StatisticsService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.stat.getContractStatus().subscribe({
      next: (res: any) => {
        this.data = res.data;
        this.loadChart(this.data.paymentsByMonth);
      },
      error: (error) => {
        console.log('Error fetching data: ', error);
      },
    });
  }

  loadChart(data: any) {
    const totalPaid = data.map((m: any) => m.totalPaid);
    const totalDue = data.map((m: any) => m.totalDue);
    const totalRemaining = data.map((m: any) => m.totalRemaining);
    this.chart = new Chart('ContractsCanvas', {
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
            label: 'اجمالي مبالغ متبقية',
            data: totalRemaining,
            borderWidth: 1,
          },
          {
            label: 'اجمالي مبالغ المدفوع ',
            data: totalPaid,
            borderWidth: 1,
          },
          {
            label: 'اجمالي المستحق دفعه',
            data: totalDue,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }
}
