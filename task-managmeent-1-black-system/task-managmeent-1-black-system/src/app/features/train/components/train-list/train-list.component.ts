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
import { TrainFormComponent } from '../train-form/train-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TrainService } from '../../../../core/services/train';
import { environment } from '../../../../../environments/environment';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  subject: string;
}

@Component({
  selector: 'app-train-list',
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
  templateUrl: './train-list.component.html',
  styleUrl: './train-list.component.scss',
})
export class TrainListComponent {
  domain = environment.apiUrl;
  filters = {
    SearchTerm: '',
    PageNumber: 1,
    PageSize: 5,
    endDate: '',
    startDate: '',
  };
  snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(TrainFormComponent, {
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
    private trainService: TrainService
  ) {
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(() => this.trainService.getList(this.filters))
      )
      .subscribe((results: any) => {
        console.log(results);
        this.dataSource = results.data;
        this.totalCount = results.totalCount;
      });
  }
  dataSource: any[] = [];
  private searchSubject = new Subject<string>();

  updateSearch(value: string) {
    this.searchSubject.next(value);
    this.filters.SearchTerm = value;
  }
  newRecord() {
    this.record = null;
    this.openDialog();
  }

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
            this.trainService.delete(this.record.id).subscribe(() => {
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

  onPageChange(event: any) {
    console.log(event);
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

  totalCount: number = 0;
  loading = true;
  getList() {
    this.trainService.getList(this.filters).subscribe((res: any) => {
      this.dataSource = res.data;
      this.loading = false;
      this.totalCount = res.totalCount;
    });
  }

  react(id: number) {
    this.trainService.reactTrain(id).subscribe(() => {
      this.snackBar.open('تم تسجيل اعجابك بالدوره بنجاح ✅✅', 'Close', {
        duration: 2800,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    });
  }

  ngOnInit(): void {
    this.getList();
  }
}
