import { Component, inject } from '@angular/core';
import { formatDate } from '@angular/common';
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
import { ToastModule } from 'primeng/toast';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { tap, finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePicker } from 'primeng/datepicker';
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
    DatePicker,
  ],
  providers: [],
  templateUrl: './tenants-form.component.html',
  styleUrl: './tenants-form.component.scss',
})
export class TenantsFormComponent {
  data = inject(MAT_DIALOG_DATA).record;
  taskForm: FormGroup;
  dialogRef = inject(MatDialogRef<TenantsFormComponent>);
  loading = false;

  constructor(
    private fb: FormBuilder,
    private tenantsService: TenantsService,
    private snackBar: MatSnackBar
  ) {
    const {
      tenantName,
      email,
      password,
      // startDate,
      phoneNumber,
      subscriptionFee,
      notes,
      expirationDate,
    } = this.data || {};
    this.taskForm = this.fb.group({
      tenantName: [
        { value: tenantName ?? '', disabled: this.data },
        [Validators.required],
      ],
      email: [{ value: email ?? '', disabled: this.data }, Validators.required],
      password: [
        { value: password ?? '', disabled: this.data },
        Validators.required,
      ],
      startDate: [null],
      endDate: [
        expirationDate ? new Date(expirationDate) : null,
        Validators.required,
      ],
      phoneNumber: [{ value: phoneNumber ?? '', disabled: this.data }],
      subscriptionFee: [subscriptionFee ?? null],
      notes: [notes ?? ''],
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = {
      ...this.taskForm.getRawValue(),
      startDate: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      expirationDate: formatDate(
        this.taskForm.value.endDate,
        'yyyy-MM-dd',
        'en-US'
      ),
      endDate: formatDate(this.taskForm.value.endDate, 'yyyy-MM-dd', 'en-US'),
    };

    this.loading = true;
    const request: any = this.data
      ? this.tenantsService.update(this.data.id, {
          ...formValue,
          // name: this.taskForm.value.tenantName,
        })
      : this.tenantsService.create(formValue);

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
              ? 'تم تحديث الاشتراك بنجاح ✅✅'
              : 'تم اضافه الشركه بنجاح ✅✅',
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
    this.tenantsService.getList().subscribe((res: any) => {
      this.tenants = res.data;
    });
  }
  ngOnInit(): void {
    this.getLookup();
  }
}
