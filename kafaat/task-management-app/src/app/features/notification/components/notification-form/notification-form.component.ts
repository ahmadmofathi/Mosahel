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
import { NotificationService } from '../../../../core/services/notification';
import { ToastModule } from 'primeng/toast';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { tap, finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';

@Component({
  selector: 'app-file-form',
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
  templateUrl: './notification-form.component.html',
  styleUrl: './notification-form.component.scss',
})
export class NotificationFormComponent {
  data = inject(MAT_DIALOG_DATA).record;
  taskForm: FormGroup;
  dialogRef = inject(MatDialogRef<NotificationFormComponent>);
  loading = false;

  constructor(
    private fb: FormBuilder,
    private tenantsService: TenantsService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {
    const { title, message, tenantId } = this.data || {};
    this.taskForm = this.fb.group({
      title: [title ?? '', [Validators.required]],
      message: [message ?? '', Validators.required],
      tenantId: [tenantId ?? ''],
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const request: any = this.data
      ? this.notificationService.update(this.data.id, {
          ...this.taskForm.value,
        })
      : this.notificationService.create(this.taskForm.value);

    request
      .pipe(
        tap(() => this.dialogRef.close('refresh')),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(() => {
        this.snackBar.open(
          this.data
            ? 'تم تعديل التعميم بنجاح ✅✅'
            : 'تم اضافه التعميم بنجاح ✅✅',
          'Close',
          {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          }
        );
      });
  }
  tenants: any[] = [];
  getLookup() {
    this.tenantsService.getList({ pageSize: 1000 }).subscribe((res: any) => {
      this.tenants = res.data;
    });
  }
  ngOnInit(): void {
    this.getLookup();
  }
}
