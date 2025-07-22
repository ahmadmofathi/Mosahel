import { Component, inject } from '@angular/core';
import { ListHeaderComponent } from '../../../../shared/ui/list-header/list-header.component';
import { AuthService } from '../../../../core/services/auth.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-new-pass',
  standalone: true,
  imports: [
    ListHeaderComponent,
    CommonModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './new-pass.component.html',
  styleUrl: './new-pass.component.scss',
})
export class NewPassComponent {
  passwordForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required]],
        confirmNewPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;

    if (newPassword === confirmNewPassword) {
      return null;
    }

    return { passwordMismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.loading = true;
      this.authService.newPassword(this.passwordForm.value).subscribe({
        next: () => {
          this.loading = false;
          // Handle success - maybe show a message or redirect
        },
        error: () => {
          this.loading = false;
          // Handle error
        },
      });
    }
  }
}
