import { Component, inject } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { RequestPassComponent } from '../request-pass/request-pass.component';

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
      userType: ['employee'],
    });
  }
  userTypes: any[] = [
    { label: 'منشأة', value: 'facility' },
    { label: 'الموظف', value: 'employee' },
  ];
  loginForm!: FormGroup;

  // change password dialog
  // dialog is used to inject the MatDialog service
  readonly dialog = inject(MatDialog);

  // the openDialog function is used to open the dialog
  openDialog() {
    const dialogRef = this.dialog.open(RequestPassComponent, {
      width: '50vw',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      // if (result == 'refresh') {
      //   this.getlist();
      // }
    });
  }

  requestPass() {
    this.openDialog();
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.tokenService.setRole();
          this.isLoading = false;
          const currentRole = localStorage.getItem('role') ?? '';
          switch (currentRole) {
            case 'HRSpecialist':
              this.router.navigateByUrl('/employee');
              break;
            case 'SalesSpecialist':
              this.router.navigateByUrl('/crm');
              break;
            default:
              this.router.navigateByUrl('/dashboard');
              break;
          }
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
