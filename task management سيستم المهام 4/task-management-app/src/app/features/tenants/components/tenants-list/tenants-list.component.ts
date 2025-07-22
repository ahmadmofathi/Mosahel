import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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
import { debounceTime, distinctUntilChanged, switchMap, Subject } from 'rxjs';
import { TenantsFormComponent } from '../tenants-form/tenants-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TenantsService } from '../../../../core/services/tenants';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorIntlAr } from '../../../../core/mat-paginator-Ar';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// import arabicFont from '../../../../../assets/fonts/NotoSansArabic.ttf'
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
  selector: 'app-tenants-list',
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
    MultiSelectModule,
    MatSortModule
  ],
  templateUrl: './tenants-list.component.html',
  styleUrls: ['./tenants-list.component.scss'],
})
export class TenantsListComponent implements OnInit {
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
    { key: 'password', label: 'الرقم السري', selected: false },
    { key: 'subscriptionFee', label: 'قيمة الاشتراك', selected: true },
    { key: 'phoneNumber', label: 'رقم الهاتف', selected: true },
    { key: 'startDate', label: 'تاريخ الانشاء', selected: true },
    { key: 'endDate', label: 'تاريخ الانتهاء', selected: true },
    { key: 'notes', label: 'ملاحظات', selected: true },
    { key: 'status', label: 'الحاله', selected: true },
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
    {
      label: 'حذف',
      icon: 'pi pi-trash',
      command: (event: any) => {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'هل انت متاكد من حذف الشركة ؟',
          header: '',
          icon: 'pi pi-info-circle',
          acceptButtonStyleClass: 'p-button-danger p-button-text',
          rejectButtonStyleClass: 'p-button-text p-button-text',
          acceptLabel: 'نعم انا متاكد',
          rejectLabel: 'لا اريد ان احذف',
          acceptIcon: 'none',
          rejectIcon: 'none',
          accept: () => {
            this.tenantsService.delete(event.id).subscribe(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'تم الحذف',
                detail: 'تم حذف الشركة بنجاح',
              });
              this.getList();
            });
          },
        });
      },
    },
  ];

  currentRole: string = localStorage.getItem('role') ?? '';
  showError = false;
  showError2 =false;
  validateDates() {
    if (this.filters.startDate && !this.filters.endDate) {
      this.showError = true;
    } else {
      this.showError = false;
    }
    if (!this.filters.startDate && this.filters.endDate) {
      this.showError2 = true;
    } else {
      this.showError2 = false;
    }
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
    const dialogRef = this.dialog.open(TenantsFormComponent, {
      width: '35vw',
      data: { record: this.record },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.getList();
      }
    });
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
    this.dataSource = new MatTableDataSource<any>(results.data);
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
  dataForPDF: any[] = [];
  getList() {
    this.tenantsService.getList(this.filters).subscribe((res: any) => {
      console.log(res);
      this.dataForPDF = res.data;
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
    if (this.currentRole === 'SuperAdmin' && !this.displayedColumns.includes('edit')) {
      this.displayedColumns.push('edit');
    }
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
    generatePDF() {
      // Load Arabic font (you need to have the font file)
      const doc = new jsPDF({
        orientation: 'l', // landscape for better width
        unit: 'mm',
        format: 'a4'
      });
    
      // Add Arabic font (make sure to load the font file)
      // You can use Noto Sans Arabic from Google Fonts
      // const fontPath = 'path/to/arabic-font.ttf'; // or use CDN
      // doc.addFileToVFS('NotoSansArabic.ttf', arabicFont);
      doc.addFont('NotoSansArabic.ttf', 'NotoSansArabic', 'normal');
      doc.setFont('NotoSansArabic');
      // Prepare headers and data
      const headers = this.selectedColumns.map(col => col.label);
      const rows = this.dataForPDF.map(item => 
        this.selectedColumns.map(col => ({
          content: item[col.key],
          styles: { 
            font: 'arabic',
            halign: 'right',
            fontStyle: 'normal'
          }
        }))
      );
    
      // Configure AutoTable
      (doc as any).autoTable({
        head: [headers],
        body: rows,
        styles: {
          font: 'arabic',
          fontSize: 10,
          cellPadding: 3,
          halign: 'right'
        },
        theme: 'grid',
        direction: 'rtl',
        tableWidth: 'auto',
        columnStyles: {
          0: { cellWidth: 'auto' },
          // Add specific column widths if needed
        },
        didParseCell: (data:any) => {
          data.cell.styles.font = 'arabic';
          data.cell.styles.halign = 'right';
        },
        margin: { right: 10, left: 10 },
        pageBreak: 'auto',
        showHead: 'everyPage',
        tableLineWidth: 0.1,
        overflow: 'linebreak'
      });
    
      // Save the PDF
      doc.save('tenant-data.pdf');
    }
  ngOnInit(): void {
    // Reinitialize selectedColumns and displayedColumns based on allColumns.
    this.selectedColumns = this.allColumns.filter(col => col.selected);
    this.displayedColumns = this.selectedColumns.map(col => col.key);
    if (this.currentRole === 'SuperAdmin') {
      this.displayedColumns.push('edit');
    }
    this.getList();
  }
}
