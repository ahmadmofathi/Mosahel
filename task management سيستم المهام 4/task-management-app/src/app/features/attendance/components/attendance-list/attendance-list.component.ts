import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterListComponent } from '../../../../shared/ui/filter-list/filter-list.component';
import { ListHeaderComponent } from '../../../../shared/ui/list-header/list-header.component';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { debounceTime, distinctUntilChanged, switchMap, Subject } from 'rxjs';
import { AttendanceService } from '../../../../core/services/attendance';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { TenantsService } from '../../../../core/services/tenants';
import { ExportExcel } from '../../../../shared/utils/exportExcel';
import { EmployeeService } from '../../../../core/services/employee';
import { AttendanceEditComponent } from '../attendance-edit/attendance-edit.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import html2pdf from 'html2pdf.js';


interface ColumnDef {
  key: string;
  label: string;
  selected?: boolean;
}

@Component({
  selector: 'app-attendance-list',
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
    MatSortModule,
    MatIconModule,
    AttendanceEditComponent,
    MatButtonModule
  ],
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss'],
})
export class AttendanceListComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  // Filters including sort parameters
  filters = {
    tenantId: null,
    employeeId:null,
    searchTerm: '',
    PageNumber: 1,
    PageSize: 5,
    endDate: '',
    startDate: '',
    sortColumn: '',
    sortDirection: '',
  };

  readonly dialog = inject(MatDialog);
  private searchSubject = new Subject<string>();

  // Data source (using Angular Material's MatTableDataSource for sorting)
  dataSource!: MatTableDataSource<any>;
  totalCount: number = 0;
  loading = true;

  // List of tenants (for the dropdown)
  tenants: any[] = [];
  tenantsEmployees: any[] = [];

  // Define all available columns for the table
  allColumns: ColumnDef[] = [
    { key: 'employeeName', label: 'اسم الموظف', selected: true },
    { key: 'tenantName', label: 'الشركة', selected: true },
    { key: 'checkIn', label: 'وقت الحضور', selected: true },
    { key: 'checkOut', label: 'وقت الانصراف', selected: true },
    { key: 'date', label: 'التاريخ', selected: true },
    { key: 'workHours', label: 'ساعات العمل', selected: true },
    { key: 'actions', label: 'الإجراءات', selected: true },
  ];

  // These will hold the currently selected columns and the final list of keys for the table
  selectedColumns: ColumnDef[] = [...this.allColumns];
  displayedColumns: string[] = this.selectedColumns.map(col => col.key);

  constructor(
    private attendanceService: AttendanceService,
    private tenantsService: TenantsService,
    private employeeService: EmployeeService
  ) {
    // Listen for search term changes with debouncing
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(() => this.attendanceService.getList(this.filters))
      )
      .subscribe((results: any) => {
        this.setDataSource(results);
      });
  }

  // Update the MatTableDataSource and apply sorting
  setDataSource(results: any) {
    this.dataSource = new MatTableDataSource(results.data);
    // Configure custom sorting for the "date" column based on the checkIn property
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'date':
          return new Date(item.checkIn); // Sort by checkIn as a Date
        default:
          return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    this.totalCount = results.totalCount;
  }

  updateSearch(value: string) {
    this.filters.searchTerm = value;
    this.searchSubject.next(value);
  }

  // When the user changes the sort (via the header), update filters and refresh data
  onSort(event: any) {
    this.filters.sortColumn = event.active;
    this.filters.sortDirection = event.direction;
    this.getList();
  }

  // When the column selection changes, update the list of displayed column keys
  onColumnSelectionChange(event: any) {
    this.displayedColumns = this.selectedColumns.map(col => col.key);
  }
  openEditDialog(attendance: any): void {
    console.log(attendance)
    const dialogRef = this.dialog.open(AttendanceEditComponent, {
      width: '400px',
      data: {
        attendanceId: attendance.id,
        checkIn: attendance.checkIn,
        lastCheckOut: attendance.lastCheckOut
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(result,"result after closing")
      if (result) {
        this.attendanceService.update(result).subscribe({
          next: () => {
            // Refresh the list after successful update
            this.getList();
          },
          error: (error) => {
            console.error('Error updating attendance:', error);
            // Handle error (show message to user)
          }
        });
      }
    });
  }
  // Export to Excel using your attendance service and utility function
  exportExcel() {
    this.attendanceService.exportExcel(this.filters).subscribe((file) => {
      ExportExcel(file, 'attendance');
    });
  }

  fillEmployees(){
    if(this.filters.tenantId == null) return
    this.employeeService.getEmployeesbyTanentId(this.filters.tenantId).subscribe((res: any) => {
      this.tenantsEmployees = res;
      console.log(res)
    })
  }
  // Filter handler: format the dates (or clear them) then refresh the list
  filterHandler(isRemoved?: boolean) {
    if (isRemoved) {
      this.filters.startDate = '';
      this.filters.endDate = '';
      this.filters.tenantId = null;
    } else {
      this.filters.startDate = this.filters.startDate
        ? formatDate(this.filters.startDate, 'yyyy-MM-dd', 'en-US')
        : '';
      this.filters.endDate = this.filters.endDate
        ? formatDate(this.filters.endDate, 'yyyy-MM-dd', 'en-US')
        : '';
    }
    this.getList();
  }

  onPageChange(event: any) {
    this.filters.PageSize = event.pageSize;
    this.filters.PageNumber = event.pageIndex + 1;
    this.getList();
  }

  // Get the list of attendance records
  getList() {
    this.loading = true;
    this.attendanceService.getList(this.filters).subscribe((res: any) => {
      console.log(this.filters);
      this.setDataSource(res);
      console.log(res)
      this.loading = false;
    });
  }

  // Get the list of tenants for the dropdown (for SuperAdmin)
  getLookup() {
    this.tenantsService.getList({ pageSize: 1000 }).subscribe((res: any) => {
      this.tenants = res.data;
    });
  }

  currentRole: string = localStorage.getItem('role') ?? '';

  ngOnInit(): void {
    // Adjust available columns based on the current role
    // For example, if not SuperAdmin, remove the tenantName column;
    // if not Admin or SuperAdmin, remove the employeeName column.
    if (this.currentRole !== 'SuperAdmin') {
      this.allColumns = this.allColumns.filter(col => col.key !== 'tenantName');
    }
    if (this.currentRole !== 'Admin' && this.currentRole !== 'SuperAdmin') {
      this.allColumns = this.allColumns.filter(col => col.key !== 'employeeName');
      // Also remove actions column for Employee role
      this.allColumns = this.allColumns.filter(col => col.key !== 'actions');
    }
    // Initialize selectedColumns and displayedColumns based on available columns
    this.selectedColumns = [...this.allColumns];
    this.displayedColumns = this.selectedColumns.map(col => col.key);

    // For SuperAdmin, load the tenants lookup
    if (this.currentRole === 'SuperAdmin') {
      this.getLookup();
    }
    this.getList();
  }

  exportPDF() {
    const element = document.getElementById('pdfTable');
    if (!element) return;
  
    const options = {
      margin: 0.5,
      filename: 'attendance-list.pdf',
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
