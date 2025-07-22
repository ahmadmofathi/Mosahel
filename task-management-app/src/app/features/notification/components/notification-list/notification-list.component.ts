import { Component, inject, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
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
import { MultiSelectModule } from 'primeng/multiselect';
import { MatSortModule } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, switchMap, Subject } from 'rxjs';
import { NotificationFormComponent } from '../notification-form/notification-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotificationService } from '../../../../core/services/notification';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorIntlAr } from '../../../../core/mat-paginator-Ar';

interface ColumnDef {
  key: string;
  label: string;
  selected?: boolean;
}

@Component({
  selector: 'app-files-list',
  standalone: true,
  providers: [provideNativeDateAdapter(), ConfirmationService, MessageService,
        { provide: MatPaginatorIntl, useClass: MatPaginatorIntlAr }
  ],
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
    HasRoleDirective,
    MultiSelectModule,
    MatSortModule,
    MatTooltipModule
  ],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
})
export class NotificationListComponent {
  @ViewChild(MatSort) sort!: MatSort;

  filters = {
    searchTerm: '',
    PageNumber: 1,
    PageSize: 5,
    endDate: '',
    startDate: '',
    sortColumn: '',
    sortDirection: '',
  };

  readonly dialog = inject(MatDialog);

  allColumns: ColumnDef[] = [
    { key: 'title', label: 'العنوان', selected: true },
    { key: 'message', label: 'وصف التعميم', selected: true },
    { key: 'createdOn', label: 'تاريخ الانشاء', selected: true },
    { key: 'tenantName', label: 'اسم الشركة', selected: true },
    { key: 'edit', label: 'إجراء', selected: true },
  ];

  selectedColumns: ColumnDef[] = [...this.allColumns];

  onColumnSelectionChange(event: any) {
    this.displayedColumns = this.selectedColumns.map(col => col.key);
  }

  openDialog() {
    const dialogRef = this.dialog.open(NotificationFormComponent, {
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

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private notificationService: NotificationService
  ) {
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(() => this.notificationService.getList(this.filters))
      )
      .subscribe((results: any) => {
        this.setDataSource(results);
      });
  }

  displayedColumns: string[] = ['title', 'message', 'createdOn'];
  dataSource!: MatTableDataSource<any>;
  private searchSubject = new Subject<string>();
  totalCount: number = 0;
  loading = true;

  setDataSource(results: any) {
    this.dataSource = new MatTableDataSource(results.data);
    this.dataSource.sort = this.sort;
    this.totalCount = results.totalCount;
  }

  updateSearch(value: string) {
    this.searchSubject.next(value);
    this.filters.searchTerm = value;
  }

  onSort(event: any) {
    this.filters.sortColumn = event.active;
    this.filters.sortDirection = event.direction;
    this.getList();
  }

  newRecord() {
    this.record = null;
    this.openDialog();
  }

  items = [
    { label: 'تعديل', icon: 'pi pi-pencil', command: () => this.openDialog() },
    {
      label: 'حذف',
      icon: 'pi pi-trash',
      command: (event: any) => {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'هل انت متاكد من الحذف ؟',
          header: '',
          icon: 'pi pi-info-circle',
          acceptButtonStyleClass: 'p-button-danger p-button-text',
          rejectButtonStyleClass: 'p-button-text p-button-text',
          acceptLabel: 'نعم انا متاكد',
          rejectLabel: 'لا اريد ان احذف',
          acceptIcon: 'none',
          rejectIcon: 'none',

          accept: () => {
            this.notificationService.delete(event.id).subscribe(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'تم الحذف',
                detail: 'تم حذف بنجاح',
              });
              this.getList();
            });
          },
        });
      },
    },
  ];

  onPageChange(event: any) {
    this.filters.PageSize = event.pageSize;
    this.filters.PageNumber = event.pageIndex + 1;
    this.getList();
  }

  record: any;
  editTask(record: any) {
    this.record = record;
  }

  filterHandler(isRemoved?: boolean) {
    if (isRemoved) {
      this.filters.startDate = '';
      this.filters.endDate = '';
    } else {
      this.filters.startDate = this.filters?.startDate ? 
        formatDate(this.filters.startDate, 'yyyy-MM-dd', 'en-US') : '';
      this.filters.endDate = this.filters?.endDate ? 
        formatDate(this.filters.endDate, 'yyyy-MM-dd', 'en-US') : '';
    }
    this.getList();
  }

  getList() {
    this.loading = true;
    this.notificationService.getList(this.filters).subscribe((res: any) => {
      this.setDataSource(res);
      this.loading = false;
    });
  }

  currentRole = localStorage.getItem('role');
  
  ngOnInit(): void {
    // Initialize columns based on role
    if (this.currentRole !== 'SuperAdmin') {
      this.allColumns = this.allColumns.filter(col => col.key !== 'tenantName');
    }
    if (this.currentRole !== 'SuperAdmin' && this.currentRole !== 'Admin') {
      this.allColumns = this.allColumns.filter(col => col.key !== 'edit');
    }
    
    this.selectedColumns = [...this.allColumns];
    this.displayedColumns = this.selectedColumns.map(col => col.key);
    this.getList();
  }
}