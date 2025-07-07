import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Knob } from 'primeng/knob';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { Chart } from 'chart.js';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sales-management',
  standalone: true,
  imports: [CommonModule, Knob, FormsModule, HasRoleDirective],
  templateUrl: './sales-management.component.html',
  styleUrl: './sales-management.component.scss',
})
export class SalesManagementComponent implements OnInit, OnDestroy {
  progress = 0;
  target = 0;
  completionPercent = 0;
  private destroy$ = new Subject<void>();
  private chart!: Chart;
  isEditingTarget = false;
  newTarget: number = 0;

  constructor(private stat: StatisticsService) {}

  ngOnInit() {
    this.loadSalesData();
  }

  loadSalesData() {
    this.stat
      .getSalesDash()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const {
            targetAchievementPercentage,
            targetAmount,
            totalPaid,
            monthlySales,
          } = res;
          this.completionPercent = Number(targetAchievementPercentage) || 0;
          this.target = targetAmount || 0;
          this.progress = totalPaid || 0;
          this.loadChartData(monthlySales);
        },
      });
  }

  private loadChartData(monthlySales: { totalSales: number }[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('salesCanvas', {
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
            label: 'مجموع المبيعات',
            data: monthlySales.map(({ totalSales }) => totalSales),
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
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  toggleEditTarget() {
    this.isEditingTarget = true;
    this.newTarget = this.target;
  }

  updateTarget() {
    // Here you would typically call an API to update the target
    // For now, we'll just update the local value
    this.stat.updateTarget(this.newTarget).subscribe({
      next: () => {
        this.loadSalesData();
        this.isEditingTarget = false;
      },
      error: (e) => console.log(e),
    });
  }

  cancelEditTarget() {
    this.isEditingTarget = false;
    this.newTarget = this.target;
  }
}
