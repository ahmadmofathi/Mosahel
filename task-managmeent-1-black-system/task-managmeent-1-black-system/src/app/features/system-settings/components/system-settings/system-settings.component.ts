import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SystemSettingsService } from '../../../../core/services/system-settings.service';
import { FileUploadHandlerComponent } from '../../../../shared/ui/file-upload-handler/file-upload-handler.component';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    InputTextModule,
    TextareaModule,
    DropdownModule,
    ToastModule,
    MatProgressSpinnerModule,
    FileUploadHandlerComponent,
  ],
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss'],
})
export class SystemSettingsComponent implements OnInit {
  systemSettingsForm: FormGroup;
  data: any = null;
  loading = false;
  companyLogoUrl: string | null = null;
  companyStampUrl: string | null = null;

  // Property to store server-side errors
  serverErrors: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private systemSettingsService: SystemSettingsService
  ) {
    this.systemSettingsForm = this.fb.group({
      companyName: ['', [Validators.required]],
      CompanyTitle: ['', [Validators.required]],
      whatsAppNumber: ['', Validators.required],
      TaxNumber: ['', Validators.required],
      commercialRegister: ['', Validators.required],
      currency: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      contractTerms: ['', Validators.required],
      logoUrl: [null, Validators.required],
      stampUrl: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.systemSettingsService.getCompanySettings().subscribe((res: any) => {
      console.log(res);

      // Prepend base URL to relative image paths
      const logoUrl = this.getAbsoluteUrl(res.data.logoUrl);
      const stampUrl = this.getAbsoluteUrl(res.data.stampUrl);
      console.log(res.data);
      // Patch form values
      this.systemSettingsForm.patchValue({
        ...res.data,
        CompanyTitle: res.data.companyTitle ?? 'null',
        TaxNumber: res.data.taxNumber ?? 'null',
        logoUrl,
        stampUrl,
      });

      // Set preview URLs
      this.companyLogoUrl = logoUrl;
      this.companyStampUrl = stampUrl;
    });
  }

  private getAbsoluteUrl(relativeUrl: string): string {
    if (relativeUrl && !relativeUrl.startsWith('http')) {
      return `${environment.apiUrl}${relativeUrl}`;
    }
    return relativeUrl;
  }

  onFileChange(event: Event, field: string): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        // 5MB limit
        this.systemSettingsForm.patchValue({ [field]: file });

        // Generate a URL for the selected file
        const reader = new FileReader();
        reader.onload = () => {
          if (field === 'logoUrl') {
            this.companyLogoUrl = reader.result as string;
          } else if (field === 'stampUrl') {
            this.companyStampUrl = reader.result as string;
          }
        };
        reader.readAsDataURL(file);
      } else {
        this.snackBar.open('الرجاء تحميل صورة بحجم أقل من 5MB', 'إغلاق', {
          duration: 5000,
        });
      }
    }
  }

  handleFileSelected(file: File, field: string) {
    this.systemSettingsForm.patchValue({ [field]: file });
    if (field === 'logoUrl') {
      this.handleFile(file, 'logoUrl');
    } else if (field === 'stampUrl') {
      this.handleFile(file, 'stampUrl');
    }
  }

  handleCancelClicked(field: string) {
    this.removeImage(field);
  }

  private removeImage(field: string) {
    if (field === 'logoUrl') {
      this.companyLogoUrl = null;
    } else if (field === 'stampUrl') {
      this.companyStampUrl = null;
    }
    this.systemSettingsForm.patchValue({ [field]: null });
    this.systemSettingsForm.get(field)?.updateValueAndValidity();
  }

  private handleFile(file: File, field: string) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (field === 'logoUrl') {
          this.companyLogoUrl = e.target?.result as string;
        } else if (field === 'stampUrl') {
          this.companyStampUrl = e.target?.result as string;
        }
      };
      reader.readAsDataURL(file);
    } else {
      this.snackBar.open('الرجاء تحميل صورة بحجم أقل من 5MB', 'إغلاق', {
        duration: 5000,
      });
    }
  }

  onSubmit() {
    if (this.systemSettingsForm.invalid) {
      this.systemSettingsForm.markAllAsTouched();
      return;
    }

    // Set loading to true
    this.loading = true;

    // Clear previous server errors
    this.serverErrors = {};

    this.systemSettingsService
      .saveSettings(this.systemSettingsForm.value)
      .subscribe({
        next: () => {
          // Reset loading to false on success
          this.loading = false;
          this.snackBar.open('تم حفظ الإعدادات بنجاح ✅', 'إغلاق', {
            duration: 5000,
          });
        },
        error: (error) => {
          // Reset loading to false on error
          this.loading = false;
          console.log(error);
          // Handle server-side validation errors
          if (error.error && error.error.errors) {
            this.serverErrors = error.error.errors;
          } else {
            this.snackBar.open('فشل في حفظ الإعدادات ❌', 'إغلاق', {
              duration: 5000,
            });
          }
        },
      });
  }
}
