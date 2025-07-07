import { Component, inject } from '@angular/core';
import { formatDate } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterListComponent } from '../../../../shared/ui/filter-list/filter-list.component';
import { ListHeaderComponent } from '../../../../shared/ui/list-header/list-header.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  Subject,
  of,
} from 'rxjs';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TaskService } from '../../../../core/services/task';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { DropdownModule } from 'primeng/dropdown';
import { TenantsService } from '../../../../core/services/tenants';
import { ExportExcel } from '../../../../shared/utils/exportExcel';
import { ActivatedRoute, Router } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  subject: string;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  providers: [provideNativeDateAdapter(), ConfirmationService, MessageService],
  imports: [
    CommonModule,
    MatTableModule,
    ListHeaderComponent,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FilterListComponent,
    FormsModule,
    MatDialogModule,
    MenuModule,
    ConfirmDialogModule,
    ToastModule,
    DropdownModule,
    HasRoleDirective,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  filters = {
    tenantId: null,
    searchTerm: '',
    pageNumber: 1,
    pageSize: 5,
    startDate: '',
    endDate: '',
  };
  snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);
  params: any;

  taskStatusesAr: any = {
    Completed: 'مكتمله',
    InProgress: 'مستمرة',
    Overdue: 'منتهية',
    '1': 'جديده',
    New: 'جديده',
  };
  openDialog() {
    if (this.done) {
      // this.taskService.downloadTask(this.taskToDownload);
      confirm(
        `Are you sure you want to download ${this.taskToDownload.description}?`
      );
      return;
    }
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '35vw',
      data: {
        record: this.record,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'refresh') {
        this.getList();
      }
    });
  }
  totalCount: number = 0;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private taskService: TaskService,
    private tenantsService: TenantsService,
    private router: ActivatedRoute
  ) {
    this.router.queryParams.subscribe((params: any) => {
      this.params = params;
    });
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(() => this.taskService.getList(this.filters))
      )
      .subscribe((results: any) => {
        console.log(results);
        this.dataSource = results.data;
        this.totalCount = results.totalCount;
      });
  }
  displayedColumns: string[] = [
    'description',
    'notes',
    'employeeNames',
    'completionPercentage',
    'tenantName',
    'status',
    'startDate',
    'endDate',
    'edit',
  ];

  dataSource: any[] = [];
  private searchSubject = new Subject<string>();

  updateSearch(value: string) {
    this.searchSubject.next(value);
    this.filters.searchTerm = value;
  }
  newRecord() {
    this.record = null;
    this.openDialog();
  }

  done: boolean = false;
  taskToDownload: any;

  private _items: any[] = [];

  setDone(value: any) {
    this.taskToDownload = value;
    this.done = value.status === 'Completed' ? true : false;
    console.log(this.done);
    this.updateItems(); // Update the items array when done changes
  }

  private updateItems() {
    this._items = [
      ...(this.done
        ? [
            {
              label: 'تنزيل',
              icon: 'pi pi-download',
              command: () => this.openDialog(),
            },
          ]
        : []),
      {
        label: 'تعديل',
        icon: 'pi pi-pencil',
        command: () => this.openDialog(),
      },
      {
        label: 'حذف',
        icon: 'pi pi-trash',
        command: (event: any) => {
          this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'هل انت متاكد من حذف المهمه ؟',
            header: '',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            rejectButtonStyleClass: 'p-button-text p-button-text',
            acceptLabel: 'نعم انا متاكد',
            rejectLabel: 'لا اريد ان احذف',
            acceptIcon: 'none',
            rejectIcon: 'none',

            accept: () => {
              console.log('rec', this.record);
              this.taskService.delete(this.record.id).subscribe(() => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'تم الحذف',
                  detail: 'تم حذف المهمه بنجاح',
                });
                this.getList();
              });
            },
          });
        },
      },
    ];
  }

  get items() {
    return this._items; // Return the cached array
  }

  updatePercent(id: any, event: any): void {
    if (+event.value > 100 || +event.value < 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'احذر',
        detail: 'تم ادخال رقم غير صحيح',
      });
      return;
    }
    this.taskService
      .updateCompletionPercentage({
        taskId: id,
        percentage: event.value,
      })
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'تم بنجاح',
          detail: 'تم تحديث نسبه الاكتمال بنجاح',
        });
      });
  }

  onPageChange(event: any) {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex + 1;
    this.getList();
  }

  fetchResults() {
    return of();
  }

  record: any;
  editTask(record: any) {
    this.record = record;
  }

  startTask(id: any) {
    this.taskService.startTask(id).subscribe(() => {
      this.getList();
    });
  }

  completeTask(id: any) {
    this.taskService.completeTask(id).subscribe(() => {
      this.getList();
    });
  }

  filterHandler(isRemoved?: boolean) {
    if (isRemoved) {
      this.filters.startDate = '';
      this.filters.endDate = '';
      this.filters.tenantId = null;
    } else {
      this.filters.startDate = this.filters?.startDate
        ? formatDate(this.filters?.startDate, 'yyyy-MM-dd', 'en-US')
        : '';
      this.filters.endDate = this.filters?.endDate
        ? formatDate(this.filters?.endDate, 'yyyy-MM-dd', 'en-US')
        : '';
    }
    this.getList();
  }

  loading = true;
  getList() {
    this.taskService.getList(this.filters).subscribe((res: any) => {
      const data: any[] = res.data;
      console.log(data);
      this.dataSource = this.params.s
        ? data.filter((d: any) => this.params.s == d.status)
        : data;
      this.totalCount = res.totalCount;
      this.loading = false;
    });
  }
  currentRole = localStorage.getItem('role') ?? '';
  tenants = [];
  getLookup() {
    this.tenantsService.getList({ pageSize: 1000 }).subscribe((res: any) => {
      this.tenants = res.data;
    });
  }

  exportExcel() {
    this.taskService.exportExcel(this.filters).subscribe((file) => {
      ExportExcel(file, 'attendance');
    });
  }
  ngOnInit(): void {
    if (!['SuperAdmin', 'OperationsManager'].includes(this.currentRole)) {
      this.displayedColumns = this.displayedColumns.filter(
        (x) => x !== 'tenantName'
      );
    } else {
      this.getLookup();
    }
    this.getList();
  }
}
