import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
import { MultiSelectModule } from 'primeng/multiselect';
import { MatSortModule } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, switchMap, Subject } from 'rxjs';
import { FileFormComponent } from '../file-form/file-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FilesService } from '../../../../core/services/files';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { environment } from '../../../../../environments/environment';

// Define a simple interface for our columns
interface ColumnDef {
  key: string;
  label: string;
  selected?: boolean;
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
    HasRoleDirective,
    MultiSelectModule,
    MatSortModule,
  ],
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss'],
})
export class FilesListComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  domain = environment.apiUrl;
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

  // Define the available columns with a default selection state
  allColumns: ColumnDef[] = [
    { key: 'employeeName', label: 'اسم الموظف', selected: true },
    { key: 'fileName', label: 'عنوان الملف', selected: true },
    { key: 'taskItemName', label: 'المهمه المتعلقه بالملف', selected: true },
    { key: 'fileUrl', label: 'مرفقات', selected: true },
    { key: 'createdOn', label: 'تاريخ الانشاء', selected: true },
  ];

  // This will hold the current selection of columns
  selectedColumns: ColumnDef[] = [...this.allColumns];
  // displayedColumns is computed from the selected columns
  displayedColumns: string[] = this.selectedColumns.map(col => col.key);

  dataSource!: MatTableDataSource<any>;
  totalCount: number = 0;
  loading = true;
  private searchSubject = new Subject<string>();

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private filesService: FilesService
  ) {
    // Listen to search changes and get the list with debouncing
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(() => this.filesService.getList(this.filters))
      )
      .subscribe((results: any) => {
        this.setDataSource(results);
      });
  }

  // Update the dataSource with a MatTableDataSource and apply sorting
  setDataSource(results: any) {
    this.dataSource = new MatTableDataSource(results.data);
    this.dataSource.sort = this.sort;
    this.totalCount = results.totalCount;
  }

  // Called when the search term changes
  updateSearch(value: string) {
    this.filters.searchTerm = value;
    this.searchSubject.next(value);
  }

  // Called when a sort event occurs
  onSort(event: any) {
    this.filters.sortColumn = event.active;
    this.filters.sortDirection = event.direction;
    this.getList();
  }

  // Called when the user changes the column selection
  onColumnSelectionChange(event: any) {
    this.displayedColumns = this.selectedColumns.map(col => col.key);
  }

  openDialog() {
    const dialogRef = this.dialog.open(FileFormComponent, {
      width: '35vw',
      data: {
        record: this.record,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.getList();
      }
    });
  }

  newRecord() {
    this.record = null;
    this.openDialog();
  }

  // Menu items for actions (edit, delete, etc.)
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
            this.filesService.delete(this.record.id).subscribe(() => {
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

  // Paginator change event
  onPageChange(event: any) {
    this.filters.PageSize = event.pageSize;
    this.filters.PageNumber = event.pageIndex + 1;
    this.getList();
  }

  handleFile(fileUrl: string) {
    fileUrl = this.domain + '/' + fileUrl;
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
    if (fileExtension === 'pdf') {
      window.open(fileUrl, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileUrl.split('/').pop() || 'downloaded_file';
      link.click();
    }
  }

  record: any;
  editTask(record: any) {
    this.record = record;
  }

  // Filter handler to process date filters
  filterHandler(isRemoved?: boolean) {
    if (isRemoved) {
      this.filters.startDate = '';
      this.filters.endDate = '';
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

  // Get the list from the FilesService
  getList() {
    this.loading = true;
    this.filesService.getList(this.filters).subscribe((res: any) => {
      this.setDataSource(res);
      this.loading = false;
    });
  }

  currentRole = localStorage.getItem('role');

  ngOnInit(): void {
    // Adjust available columns based on role. For example, if the current role is SuperAdmin, add a tenantName column.
    if (this.currentRole === 'SuperAdmin') {
      this.allColumns.splice(
        this.allColumns.length,
        0,
        { key: 'tenantName', label: 'اسم الشركة', selected: true }
      );
    }
    // Initialize the selected columns and displayed columns
    this.selectedColumns = [...this.allColumns];
    this.displayedColumns = this.selectedColumns.map(col => col.key);
    this.getList();
  }
}
