import { CommonModule, formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ListHeaderComponent } from '../../../../shared/ui/list-header/list-header.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FilterListComponent } from '../../../../shared/ui/filter-list/filter-list.component';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ValiditiesService } from '../../../../core/services/validities.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { ValiditiesFormComponent } from '../../components/validities-form/validities-form.component';

@Component({
  selector: 'app-validities-list',
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
  templateUrl: './validities-list.component.html',
  styleUrl: './validities-list.component.scss',
})
export class ValiditiesListComponent {
  // constructor //
  constructor(
    private validitiesService: ValiditiesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(() => this.validitiesService.getEmployees())
      )
      .subscribe((results: any) => {
        this.employees = results;
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

  // employee
  employees: any[] = [];
  employee: any = null;
  totalCount: number = 0;

  // Roles
  roles = ['OperationsManager', 'HRSpecialist', 'SalesSpecialist'];

  // private searchSubject
  private searchSubject = new Subject<string>();

  // display columns
  displayedColumns = [
    'fullName',
    'email',
    'jobNumber',
    'phoneNumber',
    'identityNumber',
    'jobTitle',
    'roles',
    'createdOn',
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
        this.editEmployee(this.employee);
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
            this.validitiesService
              .deleteEmployee(this.employee.id)
              .subscribe(() => {
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

  // user role
  currentRole = localStorage.getItem('role') ?? '';

  // methods //

  // dialog
  readonly dialog = inject(MatDialog);
  openDialog() {
    const dialogRef = this.dialog.open(ValiditiesFormComponent, {
      width: '40vw',
      data: {
        record: this.employee,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'refresh') {
        this.getList();
      }
    });
  }

  // Method to set the selected bill
  setSelectedBill(employee: any) {
    this.employee = employee;
  }

  // get list
  getList() {
    this.validitiesService.getEmployees(this.filters).subscribe((res: any) => {
      this.employees = res.data;
      this.totalCount = res.totalCount;
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
  addEmployee() {
    this.employee = null;
    this.openDialog();
  }

  // edit bill
  editEmployee(record: any) {
    this.employee = record;
    this.openDialog();
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
    if (!['SuperAdmin', 'OperationsManager'].includes(this.currentRole)) {
      this.displayedColumns.pop();
    }
    this.getList();
  }
}
