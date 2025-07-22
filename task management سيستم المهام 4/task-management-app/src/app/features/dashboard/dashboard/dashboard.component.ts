import { Component, inject, signal } from '@angular/core';
import { TasksClassificationComponent } from '../components/tasks-classification/tasks-classification.component';
import { AllTasksComponent } from '../components/all-tasks/all-tasks.component';
import { HasRoleDirective } from '../../../core/directives/has-role.directive';
import { NotificationService } from '../../../core/services/notification';
import { DatePipe } from '@angular/common';
import { AttendanceService } from '../../../core/services/attendance';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatisticsService } from '../../../core/services/statistics.service';
import { TasksDaysComponent } from '../components/tasks-days/tasks-days.component';
import { DatePicker } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Knob } from 'primeng/knob';
import { StatTenantsComponent } from '../components/stat-tenants/stat-tenants.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TenantsService } from '../../../core/services/tenants';
import { ServiceRequestService } from '../../../core/services/service-request/service-request.service';
import { JobApplicationService } from '../../../core/services/job-application/job-application.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  providers :[ConfirmationService,MessageService],
  imports: [
    TasksClassificationComponent,
    AllTasksComponent,
    HasRoleDirective,
    DatePipe,
    TasksDaysComponent,
    DatePicker,
    CommonModule,
    FormsModule,
    ConfirmDialogModule,
    Knob,
    StatTenantsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  notiService = inject(NotificationService);
  attendanceService = inject(AttendanceService);
  statService = inject(StatisticsService);
  snackBar = inject(MatSnackBar);
  currentRole = localStorage.getItem('role') ?? '';
  protected date = signal([]);
  today = new Date();
  isLiked = false;
  expiration:any;
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private tenantsService:TenantsService,
    private serviceRequestService: ServiceRequestService,
    private jobApplicationService: JobApplicationService
  ){}
  react() {
    this.notiService.react(this.currentNoti.id).subscribe(() => {
      this.isLiked = true;
    });
  }

  checkIn() {
    this.attendanceService.checkIn().subscribe(() => {
      this.showMessage('تم تسجيل الحضور بنجاح ✅✅');
      this.getCurrentAttendance();
    });
  }
  checkOut(id: number,event:any) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'هل انت متأكد من تسجيل الانصراف ؟',
        header: '',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: 'p-button-danger p-button-text',
        rejectButtonStyleClass: 'p-button-text p-button-text',
        acceptLabel: 'نعم',
        rejectLabel: 'لا',
        acceptIcon: 'none',
        rejectIcon: 'none',

        accept: () => {
          this.attendanceService.checkOut(id).subscribe(() => {
            this.showMessage('تم تسجيل الانصراف بنجاح ✅✅');
            this.getCurrentAttendance();
          });
        },
      });
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  compStat = {
    currentStat: {},
    completionPercent: 0,
  };
  currentStat: any;

  completionPercent: any = 0;
  getStatsComp() {
    this.statService.getStatsTent().subscribe((res: any) => {
      this.currentStat = res;
      console.log(res);
      const total = res?.continuedTasks + res?.newTasks + res?.overdue + res?.completedTasks;
      // console.log('total:', total, 'res.completedTasks:', res.completedTasks);
      this.completionPercent = total > 0 ? (res.completedTasks /  total) * 100 : 0;
      if (res.completedTasks == 0) {
        this.completionPercent = 0;
      }
    });
  }
  subscriptionLeft = 999999999999;

  updateSubscriptionLeft(value: number) {
    this.subscriptionLeft = value;
  }
  getStatsEmp() {
    this.statService.getStatsEmp().subscribe((res: any) => {
      this.currentStat = {
        totalTasks: res.TotalTasks,
        completedTasks: res.Completed,
        continuedTasks: res.InProgress,
        newTasks: res.New,
      };
      this.completionPercent = res.CompletionPercentage;
    });
  }

  getCurrentAttendance() {
    this.attendanceService.getCurrentAttendance().subscribe((res) => {
      this.currentAttendance = res;
      console.log(this.currentAttendance);
    });
  }

  getLatestNoti() {
    this.notiService.getLatest().subscribe((res) => {
      this.currentNoti = res;
    });
  }
  // currentUtcDate = new Date().toISOString();
  currentAttendance: any;
  currentNoti: any;

  superCount: any;
  getCountSuper() {
    this.statService.getTasksCountSuper().subscribe((res) => {
      this.superCount = res;
    });
  }
  ngOnInit(): void {
    console.log(this.currentRole)
    if (this.currentRole === 'Employee') {
      this.getCurrentAttendance();
      this.getStatsEmp();
    }
    if (['Admin', 'Employee'].some((role) => this.currentRole === role)) {
      this.getLatestNoti();
    }

    if (this.currentRole === 'Admin') {
      this.getStatsComp();
      this.tenantsService.getTenantExpiration().subscribe((res)=>{
        this.expiration = res;
      })
    }
    if (this.currentRole === 'SuperAdmin') {
      this.getCountSuper();
    }
  }
}
