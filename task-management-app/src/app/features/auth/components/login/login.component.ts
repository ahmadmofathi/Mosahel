import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TokenService } from '../../../../core/services/token.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    RadioButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      adminOrEmployee: [1, Validators.required],
    });
  }
  userTypes: any[] = [
    { label: 'منشأة', value: 1},
    { label: 'الموظف', value: 2 },
  ];
  loginForm!: FormGroup;
  onLogin() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.isLoading = true;

      const { email, password, adminOrEmployee } = this.loginForm.value;
      this.authService.login(email, password,adminOrEmployee).subscribe({
        next: () => {
          this.tokenService.setRole();
          this.isLoading = false;
          this.router.navigateByUrl('/dashboard');
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  isLoading = false;

  ngOnInit(): void {}
}
