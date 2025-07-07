import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DealsService } from '../../../../core/services/deals.service';
import { MessageService } from 'primeng/api';
import { TenantsService } from '../../../../core/services/tenants';
import { EmployeeService } from '../../../../core/services/employee';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { MatSpinner } from '@angular/material/progress-spinner';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-deals-form',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    LoadingSpinnerComponent,
    MatSpinner,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    Toast,
  ],
  templateUrl: './deals-form.component.html',
  styleUrls: ['./deals-form.component.scss'],
})
export class DealsFormComponent implements OnInit {
  dealForm: FormGroup;
  isEditMode: boolean = false;
  tentantsList: any[] = [];
  employeesList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private tentants: TenantsService,
    private empServ: EmployeeService,
    private dialogRef: MatDialogRef<DealsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dealsService: DealsService,
    private messageService: MessageService // Injected here
  ) {
    this.dealForm = this.fb.group({
      projectName: ['', Validators.required],
      // contractNumber: ['', Validators.required],
      contractValue: ['', Validators.required],
      tenantId: ['', Validators.required],
      employeeIds: [[], Validators.required],
      projectDuration: [0],
      startDate: ['', Validators.required],
      // status: ['', Validators.required],
    });

    if (this.data && this.data.record) {
      this.isEditMode = true;
      console.log(this.data.record);
      this.dealForm.patchValue(this.data.record);
    }
    this.dealForm.patchValue({ status: 'Pending' });
  }

  ngOnInit(): void {
    this.tentants.getList().subscribe((res: any) => {
      this.tentantsList = res.data;
      this.dealForm.patchValue({
        tenantId: this.tentantsList.filter(
          (t) => t.tenantName === this.data.record.tenantName
        )[0].id,
      });
      this.getEmployees(this.dealForm.value.tenantId);
    });
  }

  getEmployees(id: string) {
    console.log(id);
    this.empServ.getEmployeesbyTanentId(id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.employeesList = res;
        console.log(
          res,
          this.data.record,
          this.employeesList
            .filter((e) => this.data.record.employeeNames.includes(e.fullName))
            .map((e) => e.id)
        );
        this.dealForm.patchValue({
          employeeIds: this.employeesList
            .filter((e) => this.data.record.employeeNames.includes(e.fullName)) // Filter employees who match names
            .map((e) => e.id), // Extract their IDs
        });
      },
      error: (er) => console.log(er),
    });
  }

  isLoading: boolean = false;
  onSubmit() {
    if (this.dealForm.valid) {
      let formData = this.dealForm.value;
      formData = { ...formData, projectDuration: +formData.projectDuration };
      console.log(formData);
      this.isLoading = true;
      if (this.isEditMode) {
        // Update existing deal
        this.dealsService
          .updateDeal({ id: this.data.record.id, ...formData })
          .subscribe({
            next: () => {
              this.isLoading = false;
              this.messageService.add({
                severity: 'success',
                summary: 'تم التحديث',
                detail: 'تم تحديث العقد بنجاح',
              });
              this.dialogRef.close('refresh');
            },
            error: () => {
              this.isLoading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: 'فشل في تحديث العقد',
              });
            },
          });
      } else {
        // Create new deal
        this.dealsService.addDeal(formData).subscribe({
          next: () => {
            this.isLoading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'تم الحفظ',
              detail: 'تم إضافة العقد بنجاح',
            });
            setTimeout(() => {
              this.dialogRef.close('refresh');
            }, 1300);
          },
          error: () => {
            this.isLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل في إضافة العقد',
            });
          },
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
