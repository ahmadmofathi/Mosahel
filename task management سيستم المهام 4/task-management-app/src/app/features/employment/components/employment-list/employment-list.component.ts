import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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
import { debounceTime, distinctUntilChanged, switchMap, Subject } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TenantsService } from '../../../../core/services/tenants';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatSortModule } from '@angular/material/sort';
import { JobApplicationService } from '../../../../core/services/job-application';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  subject: string;
}

// Define an interface for dynamic column definitions.
interface ColumnDef {
  key: string;
  label: string;
  selected?: boolean;
}

@Component({
  selector: 'app-employment-list',
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
    MultiSelectModule,
    MatSortModule
  ],
  templateUrl: './employment-list.component.html',
  styleUrl: './employment-list.component.scss'
})
export class EmploymentListComponent  implements OnInit {
  // Add a ViewChild for the MatSort directive.
  @ViewChild(MatSort) sort!: MatSort;

  // Define filters including sort parameters (if doing server-side sorting).
  filters = {
    searchTerm: '',
    PageNumber: 1,
    PageSize: 5,
    endDate: '',
    startDate: '',
    sortColumn: '',
    sortDirection: ''
  };
  employmentService = inject(JobApplicationService)
  readonly dialog = inject(MatDialog);
  private searchSubject = new Subject<string>();

  // Use MatTableDataSource with an explicit generic type.
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  totalCount: number = 0;
  loading = true;
  record: any;

  // Define all columns with labels and initial selected status.
  // Here, the 'password' column (الرقم السري) is hidden initially (selected: false).
  allColumns: ColumnDef[] = [
    { key: 'tenantName', label: 'الاسم', selected: true },
    { key: 'email', label: 'البريد الالكتروني', selected: true },
    { key: 'phoneNumber', label: 'رقم الهاتف', selected: true },
    { key: 'attachment', label: 'مرفقات', selected: true },
    { key: 'startDate', label: 'تاريخ الانشاء', selected: true },
  ];

  // Initialize selectedColumns and displayedColumns.
  selectedColumns: ColumnDef[] = this.allColumns.filter(col => col.selected);
  displayedColumns: string[] = this.selectedColumns.map(col => col.key);

  // Menu items for actions.
  items = [
    {
      label: 'تجديد الاشتراك',
      icon: 'pi pi-pencil',
      command: () => this.openDialog(),
    },
  ];

  currentRole: string = localStorage.getItem('role') ?? '';

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private tenantsService: TenantsService
  ) {
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(() => this.tenantsService.getList(this.filters))
      )
      .subscribe((results: any) => {
        this.setDataSource(results);
      });
  }

  updateSearch(value: string) {
    this.filters.searchTerm = value;
    this.searchSubject.next(value);
  }

  newRecord() {
    this.record = null;
    this.openDialog();
  }

  openDialog() {
    // const dialogRef = this.dialog.open(TenantsFormComponent, {
    //   width: '35vw',
    //   data: { record: this.record },
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === 'refresh') {
    //     this.getList();
    //   }
    // });
  }

  onPageChange(event: any) {
    this.filters.PageSize = event.pageSize;
    this.filters.PageNumber = event.pageIndex + 1;
    this.getList();
  }

  filterHandler(isRemoved?: boolean) {
    this.filters.startDate = formatDate(this.filters.startDate, 'yyyy-MM-dd', 'en-US');
    this.filters.endDate = formatDate(this.filters.endDate, 'yyyy-MM-dd', 'en-US');
    if (isRemoved) {
      this.filters.startDate = '';
      this.filters.endDate = '';
    }
    this.getList();
  }

  // Set the data source and attach sorting.
  setDataSource(results: any) {
    this.dataSource = new MatTableDataSource<any>(results);
    // Optionally, add a custom sortingDataAccessor if needed. For example:
    // this.dataSource.sortingDataAccessor = (item, property) => {
    //   if (property === 'startDate' || property === 'endDate') {
    //     return new Date(item[property]);
    //   }
    //   return item[property];
    // };
    this.dataSource.sort = this.sort;
    this.totalCount = results.totalCount;
    this.loading = false;
  }

  getList() {
    this.employmentService.getList().subscribe((res: any) => {
      console.log(res);
      this.setDataSource(res);
    });
  }

  editTask(record: any) {
    this.record = record;
  }

  // Update displayedColumns when the user changes column selection.
  onColumnSelectionChange(event: any) {
    this.displayedColumns = this.selectedColumns.map(col => col.key);
    // If the current role is SuperAdmin, append the 'edit' column if not already present.
    // if (this.currentRole === 'SuperAdmin' && !this.displayedColumns.includes('edit')) {
    //   this.displayedColumns.push('edit');
    // }
  }

  getStatus(expirationDate: string): string {
    if (!expirationDate) return 'منتهي';
    const expDate = new Date(expirationDate);
    const today = new Date();
    expDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return expDate > today ? 'قيد العمل' : 'منتهي';
  }

  // Optional: onSort for server-side sorting.
  onSort(event: any) {
    // Update sort parameters if your backend supports server-side sorting.
    this.filters.sortColumn = event.active;
    this.filters.sortDirection = event.direction;
    this.getList();
  }
  ngOnInit(): void {
    // Reinitialize selectedColumns and displayedColumns based on allColumns.
    this.selectedColumns = this.allColumns.filter(col => col.selected);
    this.displayedColumns = this.selectedColumns.map(col => col.key);
    // if (this.currentRole === 'SuperAdmin') {
    //   this.displayedColumns.push('edit');
    // }
    this.getList();
  }

}
