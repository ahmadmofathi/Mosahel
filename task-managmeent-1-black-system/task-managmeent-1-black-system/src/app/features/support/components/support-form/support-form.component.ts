import { Component, Inject, OnDestroy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SupportService } from '../../../../core/services/support.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-support-form',
  standalone: true,
  providers: [MessageService], // Add MessageService here
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    LoadingSpinnerComponent,
    MatButtonModule,
  ],
  templateUrl: './support-form.component.html',
  styleUrls: ['./support-form.component.scss'],
})
export class SupportFormComponent implements OnDestroy {
  requestForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private supportService: SupportService,
    private messageService: MessageService
  ) {
    // Initialize the form with a reply field
    this.requestForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  //

  onSubmitReq() {
    console.log('Form Value:', this.requestForm.value);
    console.log('Form Valid:', this.requestForm.valid);

    this.isLoading = true; // Show loading spinner while submitting the form

    if (this.requestForm.valid) {
      const reply = this.requestForm.value.reply;

      // Call the service to submit the reply
      this.supportService.askForSupport(this.requestForm.value).subscribe({
        next: () => {
          console.log('done');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Your request has been sent successfully',
          });
          this.isLoading = false;
        },
        error: () => {
          console.log('error');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to send your request. Please try again later.',
          });
          this.isLoading = false;
        },
      });
    } else {
      console.log('Form is invalid. Errors:', this.requestForm.errors);
    }
  }

  ngOnDestroy() {
    this.requestForm.reset(); // Reset the form when the component is destroyed
  }
}
