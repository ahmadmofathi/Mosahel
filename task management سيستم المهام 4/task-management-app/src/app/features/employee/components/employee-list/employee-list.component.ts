import { Component, inject, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterListComponent } from '../../../../shared/ui/filter-list/filter-list.component';
import { ListHeaderComponent } from '../../../../shared/ui/list-header/list-header.component';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  Subject,
} from 'rxjs';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeeService } from '../../../../core/services/employee';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { ExportExcel } from '../../../../shared/utils/exportExcel';
import { MatSort, MatSortModule } from '@angular/material/sort';


import html2pdf from 'html2pdf.js';

export interface ColumnDefinition {
  key: string;
  label: string;
  always?: boolean;
  initiallyVisible?: boolean;
  sortable?: boolean;
}

@Component({
  selector: 'app-employee-list',
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
    MatSelectModule,
    FilterListComponent,
    FormsModule,
    MatDialogModule,
    MenuModule,
    ConfirmDialogModule,
    ToastModule,
    HasRoleDirective,
    MatSortModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent {
  @ViewChild(MatSort) sort!: MatSort;
  filters = {
    SearchTerm: '',
    PageNumber: 1,
    PageSize: 5,
    StartDate: '',
    EndDate: '',
  };

  readonly dialog = inject(MatDialog);

  dataSource = new MatTableDataSource<any>([]);

  allColumns: ColumnDefinition[] = [
    { key: 'fullName', label: 'اسم الموظف', always: true, initiallyVisible: true, sortable: true },
    { key: 'jobNumber', label: 'الرقم الوظيفي', initiallyVisible: true, sortable: true },
    { key: 'email', label: 'البريد الالكتروني', initiallyVisible: true, sortable: true },
    { key: 'phoneNumber', label: 'رقم الهاتف', initiallyVisible: true, sortable: true },
    { key: 'nationality', label: 'الجنسية', initiallyVisible: false, sortable: true },
    { key: 'identityNumber', label: 'رقم الهوية', initiallyVisible: true, sortable: true },
    { key: 'jobTitle', label: 'المسمي الوظيفي', initiallyVisible: true, sortable: true },
    { key: 'password', label: 'كلمه السر', initiallyVisible: false, sortable: false },
    { key: 'createdOn', label: 'تاريخ الانشاء', initiallyVisible: true, sortable: true }
  ];

  visibleColumns: string[] = [];
  displayedColumns: string[] = [];
  // dataSource: any[] = [];
  private searchSubject = new Subject<string>();
  totalCount: number = 0;
  loading = true;
  record: any;
  currentRole = localStorage.getItem('role');

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private employeeService: EmployeeService
  ) {
    this.visibleColumns = this.allColumns
      .filter(col => col.initiallyVisible || col.always)
      .map(col => col.key);

    this.updateDisplayedColumns();

    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(() => this.employeeService.getList(this.filters))
      )
      .subscribe((results: any) => {
        this.dataSource = results.data;
        this.totalCount = results.totalCount;
      });
  }

  ngOnInit(): void {
    this.getList();
    if (this.currentRole === 'SuperAdmin') {
      this.allColumns.splice(2, 0, { 
        key: 'tenantName', 
        label: 'الشركة', 
        initiallyVisible: true,
        sortable:true
      });
      this.allColumns.push({ 
        key: 'edit', 
        label: 'إجراء', 
        initiallyVisible: true 
      });
      
      this.visibleColumns = this.allColumns
        .filter(col => col.initiallyVisible || col.always)
        .map(col => col.key);
        
      this.updateDisplayedColumns();
    }
  }

  updateDisplayedColumns() {
    this.displayedColumns = this.allColumns
      .filter(col => col.always || this.visibleColumns.includes(col.key))
      .map(col => col.key);
  }

  onColumnSelectionChange(event: any) {
    this.visibleColumns = event.value;
    this.updateDisplayedColumns();
  }

  openDialog() {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
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

  updateSearch(value: string) {
    this.searchSubject.next(value);
    this.filters.SearchTerm = value;
  }

  newRecord() {
    this.record = null;
    this.openDialog();
  }

  exportExcel() {
    this.employeeService.exportExcel().subscribe((file) => {
      ExportExcel(file, 'employee');
    });
  }

  items = [
    { label: 'تعديل', icon: 'pi pi-pencil', command: () => this.openDialog() },
    {
      label: 'حذف',
      icon: 'pi pi-trash',
      command: (event: any) => {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'هل انت متاكد من حذف الموظف ؟',
          header: '',
          icon: 'pi pi-info-circle',
          acceptButtonStyleClass: 'p-button-danger p-button-text',
          rejectButtonStyleClass: 'p-button-text p-button-text',
          acceptLabel: 'نعم انا متاكد',
          rejectLabel: 'لا اريد ان احذف',
          acceptIcon: 'none',
          rejectIcon: 'none',
          accept: () => {
            this.employeeService.delete(event.id).subscribe(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'تم الحذف',
                detail: 'تم حذف الموظف بنجاح',
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

  editTask(record: any) {
    this.record = record;
  }

  filterHandler(isRemoved?: boolean) {
    this.filters.StartDate = formatDate(
      this.filters.StartDate,
      'yyyy-MM-dd',
      'en-US'
    );
    this.filters.EndDate = formatDate(
      this.filters.EndDate,
      'yyyy-MM-dd',
      'en-US'
    );
    if (isRemoved) {
      this.filters.StartDate = '';
      this.filters.EndDate = '';
    }
    this.getList();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getList() {
    this.employeeService.getList(this.filters).subscribe((res: any) => {
      console.log(res)
      this.loading = false;
      this.dataSource.data = res.data;
      this.totalCount = res.totalCount;
    });
  }
  exportPDF() {
    const element = document.getElementById('pdfTable');
    if (!element) return;
  
    const options = {
      margin: 0.5,
      filename: 'employee-list.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        // Handle text direction for Arabic
        onclone: (doc: { getElementsByTagName: (arg0: string) => any; }) => {
          const elements = doc.getElementsByTagName('td');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            el.style.fontFamily = 'sans-serif';
            el.style.direction = 'rtl';
            el.style.textAlign = 'right';
          }
        }
      },
      jsPDF: {
        unit: 'in',
        format: 'a3',
        orientation: 'landscape'
      }
    };
  
    html2pdf().from(element).set(options).save();
  }
  
}