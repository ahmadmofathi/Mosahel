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
import { ToastModule } from 'primeng/toast';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { tap, finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUploadHandlerComponent } from '../../../../shared/ui/file-upload-handler/file-upload-handler.component';
import { TrainService } from '../../../../core/services/train';

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
    ToastModule,
    MatProgressSpinnerModule,
    FileUploadHandlerComponent,
  ],
  providers: [],
  templateUrl: './train-form.component.html',
  styleUrl: './train-form.component.scss',
})
export class TrainFormComponent {
  data = inject(MAT_DIALOG_DATA).record;
  taskForm: FormGroup;
  dialogRef = inject(MatDialogRef<TrainFormComponent>);
  loading = false;

  constructor(
    private fb: FormBuilder,
    private trainService: TrainService,
    private snackBar: MatSnackBar
  ) {
    const { title, link, description, imageUrl } = this.data || {};
    this.taskForm = this.fb.group({
      title: [title ?? '', [Validators.required]],
      Link: [link ?? '', Validators.required],
      description: [description ?? ''],
      file: [imageUrl ?? ''],
    });
  }

  isFileRequired: boolean = false;
  uploadedLogo: any = null;
  imagePreview: any = null;
  handleFileSelected(file: File) {
    this.taskForm.patchValue({ file: file.name });
    this.uploadedLogo = file;
    this.handleFile(file);
  }

  handleCancelClicked() {
    this.removeImage();
  }

  private removeImage() {
    this.imagePreview = null;
    this.taskForm.patchValue({ img: '' });
    this.taskForm.get('file')?.updateValueAndValidity();
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
      console.error('File is not an image');
    }
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const request: any = this.data
      ? this.trainService.update(this.data.id, {
          ...this.taskForm.value,
        })
      : this.trainService.create({
          ...this.taskForm.value,
          file: this.uploadedLogo,
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
  tenants: any[] = [];
  getLookup() {
    this.trainService.getList().subscribe((res: any) => {
      this.tenants = res.data;
    });
  }
  ngOnInit(): void {
    this.getLookup();
  }
}
