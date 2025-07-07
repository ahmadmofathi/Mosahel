import { Component, inject } from '@angular/core';
import { DealsService } from '../../../../core/services/deals.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DealsFormComponent } from '../deals-form/deals-form.component';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule, formatDate } from '@angular/common';
import { ListHeaderComponent } from '../../../../shared/ui/list-header/list-header.component';
import { FilterListComponent } from '../../../../shared/ui/filter-list/filter-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { TenantsService } from '../../../../core/services/tenants';
import { ContractDetailsComponent } from '../contract-details/contract-details.component';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-deals-list',
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
    MatFormFieldModule,
    MatSelect,
    MatOption,
  ],
  templateUrl: './deals-list.component.html',
  styleUrl: './deals-list.component.scss',
})
export class DealsListComponent {
  filters = {
    searchTerm: '',
    pageNumber: 1,
    pageSize: 5,
    StartDate: '',
    EndDate: '',
  };

  private searchSubject = new Subject<string>();
  deals: any[] = [];
  totalCount: number = 0;
  deal: any = [];
  statusOptions = ['تحت الإجراء', 'مقبول', 'مرفوض', 'معلق'];

  changeStatus(element: any) {
    // Handle status change logic here
    element.status = this.statusOptions.indexOf(element.status) + 1;
    this.dealsService.updateDealStatus(element).subscribe({
      next: (response) => {
        console.log('Status changed: ', response);
        this.getList();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  readonly dialog = inject(MatDialog);

  currentRole = localStorage.getItem('role') ?? '';

  getStatusColor(status: string): string {
    switch (status) {
      case 'مقبول':
        return 'bg-green-100 text-green-800';
      case 'معلق':
        return 'bg-blue-100 text-blue-800';
      case 'تحت الإجراء':
        return 'bg-cyan-100 text-cyan-800';
      case 'مرفوض':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DealsFormComponent, {
      width: '35vw',
      data: {
        record: this.deal,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'refresh') {
        this.getList();
      }
    });
  }

  constructor(
    private dealsService: DealsService,
    private tentants: TenantsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(() => this.dealsService.getDeals())
      )
      .subscribe((results: any) => {
        console.log(results);
        this.deals = results.data;
        this.totalCount = results.totalCount;
      });
  }

  getTentantName(id: string) {
    return this.tentants.getById(id);
  }

  displayedColumns: string[] = [
    'projectName',
    'contractNumber',
    'tenantId',
    'employeeNames',
    'contractValue',
    'projectDuration',
    'startDate',
    'createdByUserName',
    'createdOn',
    'status',
    'edit',
  ];

  updateSearch(value: string) {
    this.searchSubject.next(value);
    this.filters.searchTerm = value;
  }

  newRecord() {
    this.deal = null;
    this.openDialog();
  }

  openContractDetailsDialog() {
    const dialogRef = this.dialog.open(ContractDetailsComponent, {
      width: '50vw',
      data: {
        deal: this.deal,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Handle the result if needed
    });
  }

  items = [
    {
      label: 'تفاصيل العقد',
      icon: 'pi pi-info-circle',
      command: () => this.openContractDetailsDialog(),
    },
    { label: 'تعديل', icon: 'pi pi-pencil', command: () => this.openDialog() },
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
            this.dealsService.deleteDeal(this.deal.id).subscribe(() => {
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
    console.log(event);
    this.filters.pageSize = event.pageSize;
    this.filters.pageNumber = event.pageIndex + 1;
    this.getList();
    // pageIndex , pageSize
  }

  editDeal(record: any) {
    this.deal = record;
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

  loading = true;
  getList() {
    this.loading = true;
    this.dealsService.getDeals(this.filters).subscribe((res: any) => {
      this.loading = false;
      res.data.map((tent: any) => {
        this.getTentantName(tent.tenantId).subscribe((res: any) => {
          tent.tenantId = res.tenantName;
        });
      });
      this.deals = res.data;

      this.totalCount = res.totalCount;
    });
  }

  ngOnInit(): void {
    if (!['SuperAdmin','SalesSpecialist', 'OperationsManager'].includes(this.currentRole)) {
      this.displayedColumns = this.displayedColumns.filter(
        (c) => !['tenantId', 'edit'].includes(c)
      );
    }
    if(['SalesSpecialist'].includes(this.currentRole)){
      this.displayedColumns = this.displayedColumns.filter(
        (c) => !['tenantId'].includes(c)
      );
    }
    this.getList();
  }
}
