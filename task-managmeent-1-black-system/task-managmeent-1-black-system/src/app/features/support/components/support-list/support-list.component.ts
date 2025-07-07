import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SupportFormComponent } from '../support-form/support-form.component';
import { SupportService } from '../../../../core/services/support.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { SupportDetailsComponent } from '../support-details/support-details.component';

@Component({
  selector: 'app-support-list',
  standalone: true,
  providers: [provideNativeDateAdapter(), ConfirmationService, MessageService],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    ConfirmDialogModule,
    ToastModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HasRoleDirective,
  ],
  templateUrl: './support-list.component.html',
  styleUrl: './support-list.component.scss',
})
export class SupportListComponent {
  // the filters object is used to store the filters
  filters = {
    PageNumber: 1,
    PageSize: 5,
  };

  // the problem variable is used to store the problem description
  problem: string = '';
  id: string = '';

  // the constructor is used to inject the required services
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private supportService: SupportService,
    private fb: FormBuilder
  ) {}

  // the displayedColumns array is used to display the columns in the table
  displayedColumns: string[] = [
    'fullName',
    'tenantName',
    'phone',
    'email',
    'description',
    'createdOn',
  ];

  // the dataSource array is used to store the data to be displayed in the table
  dataSource: any = [];

  // the totalCount variable is used to store the total number of records
  totalCount: number = 0;

  // the loading variable is used to show the loading spinner
  loading: boolean = true;

  // the getlist function is used to get the list of support
  getlist() {
    this.supportService
      .getSupportRequests(this.filters)
      .subscribe((res: any) => {
        console.log(res);
        this.dataSource = res.data;
        this.totalCount = res.totalCount;
        this.loading = false;
      });
  }

  // the show function is used to show the support form dialog
  show(id: string, problem: string) {
    this.problem = problem;
    this.id = id;
    this.openDialog();
  }

  // dialog is used to inject the MatDialog service
  readonly dialog = inject(MatDialog);

  // the openDialog function is used to open the dialog
  openDialog() {
    const dialogRef = this.dialog.open(SupportDetailsComponent, {
      width: '50vw',
      data: {
        problem: this.problem,
        id: this.id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'refresh') {
        this.getlist();
      }
    });
  }

  // the onPageChange function is used to change the page
  onPageChange(event: any) {
    console.log(event);
    this.filters.PageSize = event.pageSize;
    this.filters.PageNumber = event.pageIndex + 1;
    this.getlist();
  }

  // ngOnInit is used to call the getlist function
  ngOnInit() {
    this.getlist();
  }
}
