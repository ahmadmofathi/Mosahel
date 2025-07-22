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
import { environment } from '../../../../../environments/environment';
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
  maxHeight=300;
  maxWidth=600;
  currentRole:any;
  constructor(
    private fb: FormBuilder,
    private trainService: TrainService,
    private snackBar: MatSnackBar,
    private empService:EmployeeService,
    private tenantsService:TenantsService
  ) {
    this.currentRole = localStorage.getItem('role');
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
      : `${environment.apiUrl}/${imageUrl}`;
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

  // Create FormData object
  const formData = new FormData();

  // Ensure all form fields are appended (even empty ones)
  Object.keys(this.taskForm.controls).forEach((key) => {
    const value = this.taskForm.get(key)?.value;

    // Handle arrays (like multi-select fields)
    if (Array.isArray(value)) {
      value.forEach((val) => formData.append(key, val));
    } else {
      formData.append(key, value !== null && value !== undefined ? value : ''); // Ensure no missing fields
    }
  });

  // Append file if it's uploaded
  if (this.uploadedLogo) {
    formData.append('file', this.uploadedLogo);
  }

  // Determine if it's an update or create request
  const request = this.data
    ? this.trainService.update(this.data.id, formData)
    : this.trainService.create(formData);
    console.log(JSON.stringify(this.taskForm.value, null, 2));

  // Handle API request
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
    if (this.currentRole === 'Admin') {
      // Set isTotalTenants to false and disable it
      this.taskForm.get('isTotalTenants')?.setValue(false);
      this.taskForm.get('isTotalTenants')?.disable();
      
      // Get tenantId from localStorage and set it
      const tenantFromLocalStorage = localStorage.getItem('tenantId')!;
      this.taskForm.get('tenantId')?.setValue(tenantFromLocalStorage|| '');
      this.taskForm.get('tenantId')?.disable();
    }
  
  }

  // Get the list of employees for the multi-select
  fillEmployees() {
    if(!this.taskForm.get('tenantId')?.value) return;
    if(this.currentRole === 'Admin'){
      this.empService.getList().subscribe((res: any) => {
        console.log(res);
        this.employees = res.data;
        this.taskForm.patchValue({
          employeeIds: this.employees
            .filter(emp => this.taskForm.value.employeeIds.some((id: any) => id === emp.id))
            .map(emp => emp.id)
        });
      });
    }
    else{
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
}
