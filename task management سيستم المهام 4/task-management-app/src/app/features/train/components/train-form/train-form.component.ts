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
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { tap, finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUploadHandlerComponent } from '../../../../shared/ui/file-upload-handler/file-upload-handler.component';
import { TrainService } from '../../../../core/services/train';
import { EmployeeService } from '../../../../core/services/employee';
import { TenantsService } from '../../../../core/services/tenants';

@Component({
  selector: 'app-train-form',
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
    MultiSelectModule,
    CheckboxModule,
    ToastModule,
    MatProgressSpinnerModule,
    FileUploadHandlerComponent,
  ],
  templateUrl: './train-form.component.html',
  styleUrls: ['./train-form.component.scss'],
})
export class TrainFormComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA).record;
  taskForm: FormGroup;
  dialogRef = inject(MatDialogRef<TrainFormComponent>);
  loading = false;
  imagePreview: string | null = null;
  uploadedLogo: File | null = null;
  tenants: any[] = [];
  employees: any[] = [];

  constructor(
    private fb: FormBuilder,
    private trainService: TrainService,
    private snackBar: MatSnackBar,
    private empService:EmployeeService,
    private tenantsService:TenantsService
  ) {
    const { title, link, description, imageUrl, isTotalTenants, tenantId, employees } = this.data || {};

    console.log(this.data)
    // Initialize the form. If isTotalTenants is true, disable the tenantId control.
    this.taskForm = this.fb.group({
      title: [title ?? '', [Validators.required]],
      Link: [link ?? '', Validators.required],
      description: [description ?? ''],
      file: [imageUrl ?? ''],
      isTotalTenants: [isTotalTenants ?? true],
      tenantId: [{ value: tenantId ?? '', disabled: isTotalTenants ?? true }],
      employeeIds: [employees?.map((emp: { id: any; }) => emp.id) ?? []], 
    });
    console.log(this.taskForm.get('employeeIds')?.value);

    // If there's an existing image, set the preview
    if (imageUrl) {
      this.imagePreview = this.getFullImageUrl(imageUrl);
    }
  }

  ngOnInit(): void {
    this.getLookup();
    this.fillEmployees();
  }

  // Convert relative path to full URL if necessary
  private getFullImageUrl(imageUrl: string): string {
    return imageUrl.startsWith('http')
      ? imageUrl
      : `https://managmentbackend-001-site1.mtempurl.com/${imageUrl}`;
  }

  handleFileSelected(file: File) {
    this.uploadedLogo = file;
    this.taskForm.patchValue({ file: file.name });

    // Set image preview
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  handleCancelClicked() {
    this.imagePreview = null;
    this.taskForm.patchValue({ file: '' });
  }

  onIsTotalTenantsChange() {
    if (this.taskForm.get('isTotalTenants')?.value) {
      this.taskForm.get('tenantId')?.disable();
      this.taskForm.get('tenantId')?.setValue(null);
    } else {
      this.taskForm.get('tenantId')?.enable();
    }
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.taskForm.getRawValue(); // gets the value of disabled controls too

    const request = this.data
      ? this.trainService.update(this.data.id, {
          ...formData,
        })
      : this.trainService.create({
          ...formData,
          file: this.uploadedLogo, // send file object when creating new record
        });

    request
      .pipe(
        tap(() => this.dialogRef.close('refresh')),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: () => {
          this.snackBar.open(
            this.data
              ? 'تم تعديل الدوره بنجاح ✅✅'
              : 'تم اضافه الدوره بنجاح ✅✅',
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

  // Get the list of tenants for the dropdown
  getLookup() {
    this.tenantsService.getList().subscribe((res: any) => {
      console.log(res);
      this.tenants = res.data;
    });
  }

  // Get the list of employees for the multi-select
  fillEmployees() {
    if(!this.taskForm.get('tenantId')?.value) return;
    this.empService.getEmployeesbyTanentId(this.taskForm.get('tenantId')?.value).subscribe((res: any) => {
      console.log(res);
      this.employees = res;
      this.taskForm.patchValue({
        employeeIds: this.employees
          .filter(emp => this.taskForm.value.employeeIds.some((id: any) => id === emp.id))
          .map(emp => emp.id)
      });
    });
  }
}
