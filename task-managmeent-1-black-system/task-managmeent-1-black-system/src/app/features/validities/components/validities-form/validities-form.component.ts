import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MessageService } from 'primeng/api';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ValiditiesService } from '../../../../core/services/validities.service';

@Component({
  selector: 'app-validities-form',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './validities-form.component.html',
  styleUrl: './validities-form.component.scss',
})
export class ValiditiesFormComponent {
  // properties
  employeeForm: FormGroup;
  isEditMode: boolean = false;
  employeesList: any[] = [];
  roles: any[] = ['OperationsManager', 'HRSpecialist', 'SalesSpecialist'];

  // constructor
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ValiditiesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private validitiesService: ValiditiesService,
    private messageService: MessageService
  ) {
    this.employeeForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        identityNumber: ['', Validators.required],
        jobTitle: ['', Validators.required],
        jobNumber: ['', Validators.required],
        roles: [[], Validators.required], // Can be 'Admin', 'SuperAdmin', or 'Employee'
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    if (this.data && this.data.record) {
      this.isEditMode = true;
      console.log(this.data);
      this.employeeForm.patchValue({
        ...this.data.record,
        password: this.data.record.password,
        confirmPassword: this.data.record.password,
      });
    }
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password &&
      confirmPassword &&
      password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  }

  // on submit
  onSubmit() {
    if (this.employeeForm.valid) {
      let formData = this.employeeForm.value;
      formData = {
        ...formData,
        roles: [this.roles.indexOf(formData.roles) + 1],
      };
      console.log(formData);
      if (this.isEditMode) {
        // Update existing deal
        this.validitiesService
          .updateEmployee(this.data.record.id, formData)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'تم التحديث',
                detail: 'تم تحديث العقد بنجاح',
              });
              this.dialogRef.close('refresh');
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: 'فشل في تحديث العقد',
              });
            },
          });
      } else {
        // Create new deal
        this.validitiesService.addEmployee(formData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'تم الحفظ',
              detail: 'تم إضافة العقد بنجاح',
            });
            this.dialogRef.close('refresh');
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل في إضافة العقد',
            });
          },
        });
      }
    }
  }

  // on cancel
  onCancel() {
    this.dialogRef.close();
  }
}
