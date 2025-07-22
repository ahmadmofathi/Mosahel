import { Component, inject, OnInit } from '@angular/core';
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
import { MultiSelectModule } from 'primeng/multiselect';

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
    MultiSelectModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA).record;
  taskForm: FormGroup;
  dialogRef = inject(MatDialogRef<TaskFormComponent>);

  tenants: any[] = [];
  employees: any[] = [];
  loading = false;
  currentRole = localStorage.getItem('role');

  constructor(
    private fb: FormBuilder,
    private tenantsService: TenantsService,
    private employeeService: EmployeeService,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    const { tenantId, description,employees, startDate, endDate, notes } =
      this.data || {};
    console.log(this.data);
    this.taskForm = this.fb.group({
      description: [description ?? '', Validators.required],
      tenantId: [tenantId ?? localStorage.getItem('tenantId')?? ''],
      employeeIds: [employees?.map((emp: any) => emp.id) ?? [], Validators.required],
      notes: [notes ?? ''],
      startDate: [startDate ? new Date(startDate) : null, Validators.required],
      endDate: [endDate ? new Date(endDate) : null, Validators.required],
    });
    if(this.currentRole == 'Employee'){
      const user: string | null = localStorage.getItem('currentUser');
      if (user) {
        const userId = JSON.parse(user).id;
        const employeeIds = this.taskForm.get('employeeIds')?.value || [];
        employeeIds.push(userId);
        this.taskForm.patchValue({
          employeeIds: employeeIds,
        });
      }  
    }
  }

  ngOnInit(): void {
    if (this.currentRole === 'Admin') {
      this.employeeService.getList().subscribe((res: any) => {
        this.employees = res.data;
      });
    }
    this.getLookups();
  }

  getLookups() {
    if (this.currentRole === 'Admin') return;
    this.tenantsService.getList({ pageSize: 1000 }).subscribe((res: any) => {
      this.tenants = res.data;
    });
    if(this.taskForm.get('tenantId')?.value){
      this.getListEmployees(this.taskForm.get('tenantId')?.value);
    }
  }

  getListEmployees(event: any) {
    // Get employees based on tenantId
    if(this.currentRole == 'Employee') return;
    this.employeeService
      .getEmployeesbyTanentId(event.value || this.taskForm.get('tenantId')?.value)
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          // If there are employees, set the employee list
          this.employees = res;
          console.log(res);
        } else {
          // If no employees, reset the employeeIds field
          this.employees = [];
          this.taskForm.get('employeeIds')?.setValue([]); // Clear the employee selection
        }
      });
  
    // Ensure the employeeIds field is cleared if no employees are selected
    if (this.taskForm.get('employeeIds')?.value == null) {
      this.taskForm.get('employeeIds')?.setValue([]);
    }
  }
  
  printEmps(){
    console.log(this.taskForm.get('employeeIds')?.value)
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
  
    // Prepare the form data, ensure we send only employeeIds as an array of ids.
    let formValue: any = {
      ...this.taskForm.value,
       // Extract employee IDs
      startDate: formatDate(this.taskForm.value.startDate, 'yyyy-MM-dd', 'en-US'),
      endDate: formatDate(this.taskForm.value.endDate, 'yyyy-MM-dd', 'en-US'),
    };
    console.log(formValue);
    // If updating an existing task, include the id in the payload.
    if (this.data && this.data.id !== undefined) {
      formValue.id = this.data.id;
    }
  
    this.loading = true;
    let request: any = this.data
      ? this.taskService.update(this.data.id, formValue)
      : this.taskService.create(formValue);

      if(this.currentRole == 'Employee'){
        formValue = {
          description:this.taskForm.value.description,
          notes: this.taskForm.value.notes,
          startDate: formatDate(this.taskForm.value.startDate, 'yyyy-MM-dd', 'en-US'),
          endDate: formatDate(this.taskForm.value.endDate, 'yyyy-MM-dd', 'en-US'),
        };
        request = this.taskService.createEmployeeTask(formValue);
      }
  
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
        error: (err: any) => {
          console.error(err);
        },
      });
  }
  
}
