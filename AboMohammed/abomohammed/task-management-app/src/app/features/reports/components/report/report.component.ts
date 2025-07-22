import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FilterListComponent } from '../../../../shared/ui/filter-list/filter-list.component';
import { ListHeaderComponent } from '../../../../shared/ui/list-header/list-header.component';
import { HoursMinsPipe } from "../../../../shared/pipes/hours-mins.pipe";
import { ReportService } from '../../../../core/services/reports/report.service';
import { DatePipe, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import html2pdf from 'html2pdf.js';

import * as pdfMake from 'pdfmake/build/pdfmake';
import html2canvas from 'html2canvas';
import { ExportExcel } from '../../../../shared/utils/exportExcel';
import { provideNativeDateAdapter } from '@angular/material/core';
import { EmployeeService } from '../../../../core/services/employee';

import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { MatPaginatorIntlAr } from '../../../../core/mat-paginator-Ar';
import { TenantsService } from '../../../../core/services/tenants';
import { CdkTableModule } from '@angular/cdk/table';  // Optional but useful for additional table functionality


@Component({
  selector: 'app-report',
  standalone: true,
    providers: [provideNativeDateAdapter(),
      DatePipe,
      { provide: MatPaginatorIntl, useClass: MatPaginatorIntlAr }
    ],
  imports: [
    MatTableModule,
    MatButtonModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    FilterListComponent,
    ListHeaderComponent,
    HoursMinsPipe,
    DatePipe,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    CommonModule,
    MultiSelectModule,
    DropdownModule,
    CdkTableModule
],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit{
  displayedColumns: string[] = ['fName','email' , 'id','tenantName','hours', 'task'];
  dataSource: any;
  tableSource:any;
  issueDate:any;
  totalCount: number = 0;

  filters = {
    searchTerm: '',
    endDate: '',
    startDate: '',
    tenantId: '',
    employeeId: '',
    pageNumber: 1,
    pageSize: 5
  };


  constructor(
    private reportService: ReportService,
    private employeeService: EmployeeService,
    private tenantsService: TenantsService,
    private cdr:ChangeDetectorRef
  ){}


  ngOnInit(): void {
    this.getList();
    this.getTableList();
    this.getLookup();
  }

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
  tenants: any[] = [];
  tenantsEmployees: any[] = [];
  getLookup() {
    this.tenantsService.getList({ pageSize: 1000 }).subscribe((res: any) => {
      this.tenants = res.data;
    });
  }
  fillEmployees(){
    if(this.filters.tenantId == null) return
    this.employeeService.getEmployeesbyTanentId(this.filters.tenantId).subscribe((res: any) => {
      this.tenantsEmployees = res;
      console.log(res)
    })
  }
  onPageChange(event: any) {
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex + 1;
    this.getList();
    this.getTableList();
  }

  filterHandler(isRemoved?: boolean) {
    if(this.filters.startDate) this.filters.startDate = formatDate(this.filters.startDate, 'yyyy-MM-dd', 'en-US');
    if(this.filters.endDate) this.filters.endDate = formatDate(this.filters.endDate, 'yyyy-MM-dd', 'en-US');
    if (isRemoved) {
      this.filters.startDate = '';
      this.filters.endDate = '';
      this.filters.tenantId = '';
      this.filters.employeeId = '';
    }
    this.getList();
    this.getTableList();
  }
  loading = false;
  getList() {
    this.loading = true;
    console.log(this.filters);
      this.reportService.getReport(this.filters).subscribe((res: any) => {
      console.log(res);
      this.issueDate = res.issueDate;
      this.dataSource = res.tenants;
      this.totalCount = res.totalCount;
    });
    this.loading = true;
  }
  getTableList() {
    this.loading = true;
    console.log(this.filters);
      this.reportService.getTableReport(this.filters).subscribe((res: any) => {
      console.log(res);
      this.issueDate = res.issueDate;
      this.tableSource = res.employees;
      this.totalCount = res.totalCount;
    });
    this.loading = true;
  }
  isPrinting = false;
  generatePDF(): void {
    this.isPrinting = true;
    const element = document.getElementById('pdf-content');
    
    // Apply proper styles for Arabic text rendering before generating the PDF
    element!.style.direction = 'rtl';  // Right to Left for Arabic
    element!.style.fontFamily = 'Arial, Tahoma, sans-serif';  // Use a font that supports Arabic
  
    const options = {
      margin:       1,
      filename:     'generated-report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
  
    html2pdf().from(element).set(options).save();
    this.isPrinting = false;
  }
  togglePrinting() {
    this.isPrinting = true;
    this.cdr.detectChanges();
    this.generatePdf();
    this.isPrinting = false;
  }

  generatePdf() {
    console.log(this.isPrinting);
    const element = document.getElementById('pdf-content'); // The HTML element to be converted

    html2canvas(element!).then((canvas) => {
      // Get the image data URL from the canvas
      const imgData = canvas.toDataURL('image/png');

      // Create a PDF document definition
      const docDefinition = {
        content: [
          {
            image: imgData, // Add the image as content
            width: 500, // Optional: Adjust the width of the image
            alignment: 'center'
          }
        ]
      };

      // Generate the PDF and open it in a new tab
      pdfMake.createPdf(docDefinition).open();
    });
  }
  

    exportExcel() {
      this.reportService.exportExcel(this.filters).subscribe((file) => {
        ExportExcel(file, 'employee');
      });
    }
}
