import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TenantsService } from '../../../../core/services/tenants';
import { EmployeeService } from '../../../../core/services/employee';
import { TaskService } from '../../../../core/services/task';
import { tap, finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { DatePicker } from 'primeng/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormErrorComponent,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    InputTextModule,
    TextareaModule,
    CalendarModule,
    DropdownModule,
    HasRoleDirective,
    DatePicker,
    MatProgressSpinnerModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  data = inject(MAT_DIALOG_DATA).record;
  taskForm: FormGroup;
  dialogRef = inject(MatDialogRef<TaskFormComponent>);

  constructor(
    private fb: FormBuilder,
    private tenantsService: TenantsService,
    private employeeService: EmployeeService,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    const { tenantId, description, employeeIds, startDate, endDate, notes } =
      this.data || {};
    console.log(this.data);
    this.taskForm = this.fb.group({
      description: [description ?? '', [Validators.required]],
      tenantId: [tenantId ?? ''],
      employeeIds: [employeeIds ?? '', Validators.required],
      notes: [notes ?? ''],
      startDate: [startDate ? new Date(startDate) : null, Validators.required],
      endDate: [endDate ? new Date(endDate) : null, Validators.required],
    });
  }

  tenants: any[] = [];
  getLookups() {
    if (this.currentRole == 'Admin') return;
    this.tenantsService.getList({ pageSize: 1000 }).subscribe((res: any) => {
      this.tenants = res.data;
    });
  }

  employees: any[] = [];
  getListEmployees(event: any) {
    // todo getListEmployees based on tenantId= event.value
    this.employeeService
      .getEmployeesbyTanentId(event.value)
      .subscribe((res: any) => {
        this.employees = res;
      });
  }
  loading = false;
  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const formValue = {
      ...this.taskForm.value,
      employeeIds: [this.taskForm.value.employeeIds],
      startDate: formatDate(
        this.taskForm.value.startDate,
        'yyyy-MM-dd',
        'en-US'
      ),
      endDate: formatDate(this.taskForm.value.endDate, 'yyyy-MM-dd', 'en-US'),
    };
    this.loading = true;
    const request: any = this.data
      ? this.taskService.update(this.data.id, {
          ...formValue,
        })
      : this.taskService.create({
          ...formValue,
        });

    request
      .pipe(
        tap(() => this.dialogRef.close('refresh')),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.snackBar.open(
            this.data
              ? 'تم تعديل المهمه بنجاح ✅✅'
              : 'تم اضافه المهمه بنجاح ✅✅',
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            }
          );
        },
      });
  }

  currentRole = localStorage.getItem('role');
  ngOnInit(): void {
    if (this.currentRole === 'Admin') {
      this.employeeService.getList().subscribe((res: any) => {
        this.employees = res.data;
      });
    }
    this.getLookups();
  }
}
