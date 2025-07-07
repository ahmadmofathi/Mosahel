import { Component, inject } from '@angular/core';
import { formatDate } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterListComponent } from '../../../../shared/ui/filter-list/filter-list.component';
import { ListHeaderComponent } from '../../../../shared/ui/list-header/list-header.component';
import { debounceTime, distinctUntilChanged, switchMap, Subject } from 'rxjs';
import { AttendanceService } from '../../../../core/services/attendance';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { DropdownModule } from 'primeng/dropdown';
import { TenantsService } from '../../../../core/services/tenants';
import { ExportExcel } from '../../../../shared/utils/exportExcel';
import { EmployeeService } from '../../../../core/services/employee';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  subject: string;
}

@Component({
  selector: 'app-files-list',
  standalone: true,
  providers: [provideNativeDateAdapter()],
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
    DropdownModule,
    ToastModule,
    HasRoleDirective,
    MultiSelectModule,
  ],
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.scss',
})
export class AttendanceListComponent {
  filters = {
    tenantId: null,
    employeeId: null,
    searchTerm: '',
    PageNumber: 1,
    PageSize: 5,
    endDate: '',
    startDate: '',
  };

  readonly dialog = inject(MatDialog);

  // openDialog() {
  //   const dialogRef = this.dialog.open(TenantsFormComponent, {
  //     width: '35vw',
  //     data: {
  //       record: this.record,
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result == 'refresh') {
  //       this.getList();
  //     }
  //   });
  // }

  constructor(
    private attendanceService: AttendanceService,
    private tenantsService: TenantsService,
    private empStat: EmployeeService
  ) {
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(() => this.attendanceService.getList(this.filters))
      )
      .subscribe((results: any) => {
        this.dataSource = results.data;
        this.totalCount = results.totalCount;
      });
  }
  allColumns: any[] = [
    { key: 'employeeName', label: 'اسم الموظف', selected: true },
    { key: 'tenantName', label: 'الشركة', selected: true },
    { key: 'checkIn', label: 'وقت الحضور', selected: true },
    { key: 'checkOut', label: 'وقت الانصراف', selected: true },
    { key: 'date', label: 'التاريخ', selected: true },
    // { key: 'actions', label: 'الإجراءات', selected: true },
  ];
  selectedColumns: any[] = [...this.allColumns];
  displayedColumns: string[] = this.selectedColumns.map((col) => col.key);

  dataSource: any[] = [];
  private searchSubject = new Subject<string>();

  updateSearch(value: string) {
    this.searchSubject.next(value);
    this.filters.searchTerm = value;
  }
  newRecord() {
    this.record = null;
    // this.openDialog();
  }
  tenants = [];
  employees = [];
  getLookup() {
    this.tenantsService.getList({ pageSize: 1000 }).subscribe((res: any) => {
      this.tenants = res.data;
      console.log(res);
    });
  }
  onColumnSelectionChange(event: any) {
    this.displayedColumns = this.selectedColumns.map((col) => col.key);
  }

  getEmployees(tenantId: string) {
    console.log(tenantId);
    this.empStat.getEmployeesbyTanentId(tenantId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.employees = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  onPageChange(event: any) {
    console.log(event);
    this.filters.PageSize = event.pageSize;
    this.filters.PageNumber = event.pageIndex + 1;
    this.getList();
    // pageIndex , pageSize
  }

  record: any;
  editTask(record: any) {
    this.record = record;
  }

  exportExcel() {
    this.attendanceService.exportExcel(this.filters).subscribe((file) => {
      ExportExcel(file, 'attendance');
    });
  }

  downloadPDF() {
    this.attendanceService.downloadPdf().subscribe({
      next: (blob: any) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'downloaded-file.pdf'; // Name of the downloaded file
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading file:', err);
      },
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
  totalCount: number = 0;
  getList() {
    this.attendanceService.getList(this.filters).subscribe((res: any) => {
      this.dataSource = res.data;
      this.totalCount = res.totalCount;
      this.loading = false;
    });
  }

  currentRole = localStorage.getItem('role') ?? '';
  ngOnInit(): void {
    console.log(this.currentRole);
    if (!['SuperAdmin', 'OperationsManager'].includes(this.currentRole)) {
      this.allColumns = this.allColumns.filter(
        (col) => col.key !== 'tenantName'
      );
    }
    if (
      !['SuperAdmin', 'OperationsManager', 'Admin'].includes(this.currentRole)
    ) {
      this.allColumns = this.allColumns.filter(
        (col) => col.key !== 'employeeName'
      );
      // Also remove actions column for Employee role
      this.allColumns = this.allColumns.filter((col) => col.key !== 'actions');
    }
    this.getList();
    this.getLookup();
    this.selectedColumns = [...this.allColumns];
    this.displayedColumns = this.selectedColumns.map((col) => col.key);
  }
}
