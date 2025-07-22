import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OurServiceService } from '../../../../../core/services/our-service.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {
  form: FormGroup;
  isSubmited: boolean = false;

  constructor(private fb: FormBuilder, private service: OurServiceService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: [
        '',
        [Validators.required, Validators.pattern('^5[0-9]{8}$')],
      ],
      details: ['', [Validators.required]],
    });

    const savedFormData = sessionStorage.getItem('isService');
    if (savedFormData) {
      this.isSubmited = true; // Mark as submitted if data exists
    }
  }
  loading: boolean = false;
  submitForm() {
    if (this.form.invalid) return;
    this.loading = true;
    this.service
      .create(this.form.value)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.isSubmited = true;
        sessionStorage.setItem('isService', 'yes');
      });
  }
}
