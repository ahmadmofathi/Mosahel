import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { JobService } from '../../../../../core/services/job.service';
import { FileUploadResumeComponent } from '../../../../../shared/ui/file-upload-resume/file-upload-resume.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-apply-job',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, FileUploadResumeComponent],
  templateUrl: './apply-job.component.html',
  styleUrl: './apply-job.component.scss',
})
export class ApplyJobComponent {
  form: FormGroup;
  isSubmited: boolean = false;

  constructor(private fb: FormBuilder, private jobService: JobService) {
    this.form = this.fb.group({
      name: [''],
      email: ['', [Validators.email]],
      PhoneNumber: ['', [Validators.pattern('^5[0-9]{8}$')]],
      resume: ['', [Validators.required]],
    });

    const savedFormData = sessionStorage.getItem('isSubmited');
    if (savedFormData) {
      this.isSubmited = true; // Mark as submitted if data exists
    }
  }

  isFileRequired: boolean = false;
  uploadedLogo: any = null;
  imagePreview: any = null;
  handleFileSelected(file: File) {
    this.form.patchValue({ resume: file.name });
    this.uploadedLogo = file;
    this.handleFile(file);
  }

  handleCancelClicked() {
    this.removeImage();
  }

  private removeImage() {
    this.imagePreview = null;
    this.form.patchValue({ resume: '' });
    this.form.get('resume')?.updateValueAndValidity();
    this.uploadedLogo = null;
  }

  private handleFile(file: File) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview =
        'https://cdn-icons-png.flaticon.com/512/2457/2457802.png';
    }
  }
  loading: boolean = false;
  submitForm() {
    if (this.form.invalid) return;
    this.loading = true;
    this.jobService
      .create({
        ...this.form.value,
        attachment: this.uploadedLogo,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.isSubmited = true;
        sessionStorage.setItem('isSubmited', 'yes');
      });
  }
}
