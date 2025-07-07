import { Component, Inject, OnDestroy } from '@angular/core';
import {
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
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-request-pass',
  standalone: true,
  providers: [MessageService], // Add MessageService here
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './request-pass.component.html',
  styleUrl: './request-pass.component.scss',
})
export class RequestPassComponent implements OnDestroy {
  requestForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RequestPassComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { problem: string; id: string },
    private messageService: MessageService // Injected here
  ) {
    // Initialize the form with a reply field
    this.requestForm = this.fb.group({
      email: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('Form Value:', this.requestForm.value);
    console.log('Form Valid:', this.requestForm.valid);

    if (this.requestForm.valid) {
      // Call the service to submit the reply
      this.authService.requestPass(this.requestForm.value).subscribe({
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
      console.log('Form is invalid. Errors:', this.requestForm.errors);
    }
  }

  onCancel() {
    this.dialogRef.close(); // Close the dialog without submitting
  }

  ngOnDestroy() {
    this.requestForm.reset(); // Reset the form when the component is destroyed
  }
}
