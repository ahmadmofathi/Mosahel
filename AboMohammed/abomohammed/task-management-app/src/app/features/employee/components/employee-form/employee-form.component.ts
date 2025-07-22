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
import { DropdownModule } from 'primeng/dropdown';
import { TenantsService } from '../../../../core/services/tenants';
import { EmployeeService } from '../../../../core/services/employee';
import { ToastModule } from 'primeng/toast';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { tap, finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormErrorComponent,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    InputTextModule,
    TextareaModule,
    DropdownModule,
    ToastModule,
    MatProgressSpinnerModule,
    HasRoleDirective,
  ],
  providers: [],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent {
  data = inject(MAT_DIALOG_DATA).record;
  employeeService = inject(EmployeeService);
  taskForm: FormGroup;
  dialogRef = inject(MatDialogRef<EmployeeFormComponent>);
  loading = false;

  constructor(
    private fb: FormBuilder,
    private tenantsService: TenantsService,
    private snackBar: MatSnackBar
  ) {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      jobNumber,
      identityNumber,
      jobTitle,
      nationality,
      tenantId,
    } = this.data || {};
    this.taskForm = this.fb.group({
      fullName: [fullName ?? '', [Validators.required]],
      email: [email ?? '', [Validators.required,Validators.email]],
      password: [password ?? '', [Validators.required,Validators.minLength(6)]],
      phoneNumber: [phoneNumber ?? '', Validators.required],
      jobNumber: [jobNumber ?? '', Validators.required],
      identityNumber: [identityNumber ?? ''],
      jobTitle: [jobTitle ?? null, Validators.required],
      nationality: [nationality ?? null, Validators.required],
      tenantId: [tenantId ?? null,Validators.required],
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const request: any = this.data
      ? this.employeeService.update(this.data.id, {
          ...this.taskForm.value,
        })
      : this.employeeService.create(this.taskForm.value);

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
              ? 'تم تعديل الموظف بنجاح ✅✅'
              : 'تم اضافه الموظف بنجاح ✅✅',
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
  tenants: any[] = [];
  getLookup() {
    this.tenantsService.getList({ pageSize: 1000 }).subscribe((res: any) => {
      this.tenants = res.data;
    });
  }
  ngOnInit(): void {
    console.log(this.data);
    this.getLookup();
    console.log(this.taskForm)
  }
}
