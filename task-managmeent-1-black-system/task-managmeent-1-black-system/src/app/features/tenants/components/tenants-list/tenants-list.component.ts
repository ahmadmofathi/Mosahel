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
import { debounceTime, distinctUntilChanged, switchMap, Subject } from 'rxjs';
import { TenantsFormComponent } from '../tenants-form/tenants-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TenantsService } from '../../../../core/services/tenants';
import { MultiSelectModule } from 'primeng/multiselect';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  subject: string;
}

@Component({
  selector: 'app-files-list',
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
    HasRoleDirective,
  ],
  templateUrl: './tenants-list.component.html',
  styleUrl: './tenants-list.component.scss',
})
export class TenantsListComponent {
  filters = {
    searchTerm: '',
    PageNumber: 1,
    PageSize: 5,
    endDate: '',
    startDate: '',
  };

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(TenantsFormComponent, {
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
    private tenantsService: TenantsService
  ) {
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(() => this.tenantsService.getList(this.filters))
      )
      .subscribe((results: any) => {
        console.log(results);
        this.dataSource = results.data;
        this.totalCount = results.totalCount;
      });
  }
  allColumns: any[] = [
    { key: 'tenantName', label: 'الاسم', selected: true },
    { key: 'email', label: 'البريد الالكتروني', selected: true },
    { key: 'password', label: 'الرقم السري', selected: false },
    { key: 'subscriptionFee', label: 'قيمة الاشتراك', selected: true },
    { key: 'phoneNumber', label: 'رقم الهاتف', selected: true },
    { key: 'startDate', label: 'تاريخ الانشاء', selected: true },
    { key: 'endDate', label: 'تاريخ الانتهاء', selected: true },
    { key: 'notes', label: 'ملاحظات', selected: true },
    { key: 'status', label: 'الحاله', selected: true },
  ];

  // Initialize selectedColumns and displayedColumns.
  selectedColumns: any[] = this.allColumns.filter((col) => col.selected);
  displayedColumns: string[] = this.selectedColumns.map((col) => col.key);

  getStatus(expirationDate: string): string {
    if (!expirationDate) return 'منتهي';

    const expDate = new Date(expirationDate);
    const today = new Date();

    // Remove time portion for accurate date comparison
    expDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return expDate > today ? 'قيد العمل' : 'منتهي';
  }
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

  onColumnSelectionChange(event: any) {
    this.displayedColumns = this.selectedColumns.map((col) => col.key);
    // If the current role is SuperAdmin, append the 'edit' column if not already present.
    if (
      ['SuperAdmin', 'OperationsManager'].includes(this.currentRole) &&
      !this.displayedColumns.includes('edit')
    ) {
      this.displayedColumns.push('edit');
    }
  }

  items = [
    {
      label: 'تجديد الاشتراك',
      icon: 'pi pi-pencil',
      command: () => this.openDialog(),
    },
    // {
    //   label: 'حذف',
    //   icon: 'pi pi-trash',
    //   command: (event: any) => {
    //     this.confirmationService.confirm({
    //       target: event.target as EventTarget,
    //       message: 'هل انت متاكد من الحذف ؟',
    //       header: '',
    //       icon: 'pi pi-info-circle',
    //       acceptButtonStyleClass: 'p-button-danger p-button-text',
    //       rejectButtonStyleClass: 'p-button-text p-button-text',
    //       acceptLabel: 'نعم انا متاكد',
    //       rejectLabel: 'لا اريد ان احذف',
    //       acceptIcon: 'none',
    //       rejectIcon: 'none',

    //       accept: () => {
    //         this.tenantsService.delete(this.record.id).subscribe(() => {
    //           this.messageService.add({
    //             severity: 'success',
    //             summary: 'تم الحذف',
    //             detail: 'تم حذف بنجاح',
    //           });
    //           this.getList();
    //         });
    //       },
    //     });
    //   },
    // },
  ];

  onPageChange(event: any) {
    this.filters.PageSize = event.pageSize;
    this.filters.PageNumber = event.pageIndex + 1;
    this.getList();
    // pageIndex , pageSize
  }

  record: any;
  editTask(record: any) {
    this.record = record;
  }

  filterHandler(isRemoved?: boolean) {
    this.filters.startDate = formatDate(
      this.filters.startDate,
      'yyyy-MM-dd',
      'en-US'
    );
    this.filters.endDate = formatDate(
      this.filters.endDate,
      'yyyy-MM-dd',
      'en-US'
    );
    if (isRemoved) {
      this.filters.startDate = '';
      this.filters.endDate = '';
    }
    this.getList();
  }

  loading = true;
  totalCount: number = 0;
  getList() {
    this.tenantsService.getList(this.filters).subscribe((res: any) => {
      this.dataSource = res.data;
      this.loading = false;
      this.totalCount = res.totalCount;
    });
  }

  currentRole = localStorage.getItem('role') ?? '';

  ngOnInit(): void {
    this.selectedColumns = this.allColumns.filter((col) => col.selected);
    this.displayedColumns = this.selectedColumns.map((col) => col.key);
    if (['SuperAdmin', 'OperationsManager'].includes(this.currentRole))
      this.displayedColumns.push('edit');
    this.getList();
  }
}
