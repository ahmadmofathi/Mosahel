import { Component, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { BillsService } from '../../../core/services/bills.service';
import { BillsFormComponent } from '../bills-form/bills-form.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, formatDate } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ListHeaderComponent } from '../../../shared/ui/list-header/list-header.component';
import { FilterListComponent } from '../../../shared/ui/filter-list/filter-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { HasRoleDirective } from '../../../core/directives/has-role.directive';
import { TenantsService } from '../../../core/services/tenants';
import { BillDetailsComponent } from '../bill-details/bill-details.component';

@Component({
  selector: 'app-bills-list',
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
  ],
  templateUrl: './bills-list.component.html',
  styleUrl: './bills-list.component.scss',
})
export class BillsListComponent {
  // constructor //
  constructor(
    private billsService: BillsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private tentants: TenantsService
  ) {
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(() => this.billsService.getBills(this.filters))
      )
      .subscribe((results: any) => {
        console.log(results);
        this.bills = results;
        this.totalCount = results.length;
      });
  }

  // properties //

  // filters
  filters = {
    SearchTerm: '',
    PageNumber: 1,
    PageSize: 5,
    StartDate: '',
    EndDate: '',
  };

  // bills
  bills: any[] = [];
  totalCount: number = 0;
  bill: any = [];

  // private searchSubject
  private searchSubject = new Subject<string>();

  // display columns
  displayedColumns: string[] = [
    'contractNumber',
    'companyName',
    'employeeCount',
    'subscriptionFees',
    'totalAmount',
    'amountPaid',
    'remainingAmount',
    'user',
    'invoiceDate',
    'printInvoice',
    'edit',
  ];

  // laoding
  loading: boolean = true;

  // items per page
  items = [
    {
      label: 'تعديل',
      icon: 'pi pi-pencil',
      command: () => {
        this.editBill(this.bill);
      },
    },
    {
      label: 'حذف',
      icon: 'pi pi-trash',
      command: (event: any) => {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'هل انت متاكد من حذف العقد ؟',
          header: '',
          icon: 'pi pi-info-circle',
          acceptButtonStyleClass: 'p-button-danger p-button-text',
          rejectButtonStyleClass: 'p-button-text p-button-text',
          acceptLabel: 'نعم انا متاكد',
          rejectLabel: 'لا اريد ان احذف',
          acceptIcon: 'none',
          rejectIcon: 'none',

          accept: () => {
            this.billsService.removeBill(this.bill.invoiceId).subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'تم الحذف',
                  detail: 'تم حذف الموظف بنجاح',
                });
                this.getList();
              },
              error: (error) => {
                console.log(error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'خطأ',
                  detail: 'حدث خطأ أثناء الحذف',
                });
              },
            });
          },
        });
      },
    },
  ];

  // user role
  currentRole = localStorage.getItem('role') ?? '';

  // methods //

  // dialog
  readonly dialog = inject(MatDialog);
  openDialog() {
    const dialogRef = this.dialog.open(BillsFormComponent, {
      width: '50vw',
      data: {
        record: this.bill,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'refresh') {
        this.getList();
      }
    });
  }

  openPrintDialog() {
    const dialogRef = this.dialog.open(BillDetailsComponent, {
      width: 'fit-content',
      data: {
        bill: this.bill,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'refresh') {
        this.getList();
      }
    });
  }

  // Method to set the selected bill
  setSelectedBill(bill: any) {
    this.bill = bill;
    console.log(bill);
  }

  getTentantName(id: string) {
    return this.tentants.getById(id);
  }

  // get list
  getList() {
    this.billsService.getBills(this.filters).subscribe((res: any) => {
      this.bills = res.data;
      this.totalCount = res.totalCount ?? res.data.length;
      console.log(this.totalCount, res);
      this.loading = false;
    });
  }

  // filter handler
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

  // add bill
  addBill() {
    this.bill = null;
    this.openDialog();
  }

  // edit bill
  editBill(record: any) {
    this.bill = record;
    this.openDialog();
  }

  // print bill
  printBil(record: any) {
    this.bill = record;
    this.openPrintDialog();
  }

  // page change
  onPageChange(event: any) {
    this.filters.PageSize = event.pageSize;
    this.filters.PageNumber = event.pageIndex + 1;
    this.getList();
  }

  // update search term
  updateSearch(term: string) {
    this.filters.SearchTerm = term;
    this.searchSubject.next(term);
  }

  // on init
  ngOnInit() {
    if (!['SuperAdmin','SalesSpecialist', 'OperationsManager'].includes(this.currentRole)) {
      this.displayedColumns.pop();
    }
    this.getList();
  }
}
