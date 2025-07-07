import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MessageService } from 'primeng/api';
import { BillsService } from '../../../core/services/bills.service';
import { ButtonModule } from 'primeng/button';
import { TenantsService } from '../../../core/services/tenants';
import { DealsService } from '../../../core/services/deals.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Toast } from 'primeng/toast';
@Component({
  selector: 'app-bills-form',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    MatDialogModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    Toast,
  ],
  templateUrl: './bills-form.component.html',
  styleUrl: './bills-form.component.scss',
})
export class BillsFormComponent {
  private amountPaidSubject = new Subject<any>();
  private subscription: any;
  // properties
  billForm: FormGroup;
  billUForm: FormGroup;
  isEditMode: boolean = false;
  employeesList: any[] = [];
  tenants: any[] = [];
  deals: any[] = [];
  isLoading: boolean = false;

  // constructor
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BillsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private BillsService: BillsService,
    private messageService: MessageService,
    private tenantsService: TenantsService,
    private dealsServices: DealsService
  ) {
    this.billForm = this.fb.group({
      contractNumber: ['', Validators.required],
      companyName: ['', Validators.required],
      contractValue: [{ value: '', disabled: true }, Validators.required],
      remainingAmount: [{ value: '', disabled: true }, Validators.required],
      amountPaid: ['', Validators.required],
      totalAmount: [{ value: '', disabled: true }, Validators.required],
    });
    this.billUForm = this.fb.group({
      amountPaid: ['', Validators.required],
    });

    if (this.data && this.data.record) {
      this.isEditMode = true;
      console.log(this.data);
      this.billUForm.patchValue(this.data.record);
    }
  }
  // get tenants
  getTenants() {
    this.tenantsService.getList().subscribe((res: any) => {
      this.tenants = res.data;
    });
  }

  getDealsByTenantId(id: string) {
    console.log(id);
    this.dealsServices.getDealsByTenantId(id).subscribe((res: any) => {
      this.deals = res.data;
    });
  }

  setByDeal(id: string) {
    const i = this.deals.findIndex((deal: any) => deal.id === id);
    if (i === -1) {
      console.log('can not find deal');
      return;
    }
    console.log(this.deals, this.deals[i]);
    this.billForm.patchValue({
      contractValue: this.deals[i].contractValue,
      remainingAmount: this.deals[i].remainingAmount,
      totalAmount: this.deals[i].projectDuration * this.deals[i].contractValue,
    });
  }

  onAmountPaidInput(event: any) {
    this.amountPaidSubject.next(event);
  }

  onPaidChange(event: any) {
    const paidAmout = event.target.value;
    const totalAmount = this.billForm.get('totalAmount')?.value;
    const remainingAmount = totalAmount - paidAmout;
    this.billForm.patchValue({ remainingAmount });
  }

  ngOnDestroy() {
    // Cleanup subscription when component is destroyed
    this.subscription.unsubscribe();
  }

  // on submit
  onSubmit() {
    if (this.billForm.valid) {
      this.isLoading = true;
      const formData = this.billForm.value;

      // Create new deal
      this.BillsService.addBill(
        formData.contractNumber,
        formData.amountPaid
      ).subscribe({
        next: () => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'تم الحفظ',
            detail: 'تم إضافة الفاتورة بنجاح',
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
            detail: 'فشل في إضافة الفاتورة',
          });
        },
      });
    }
  }

  inUSubmit() {
    const formData = this.billUForm.value;
    console.log(
      'editing ',
      this.data.record.invoiceId,
      ' to be ',
      formData.amountPaid
    );
    // Update existing deal
    this.isLoading = true;
    this.BillsService.updateBill(
      this.data.record.invoiceId,
      formData.amountPaid
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'تم التحديث',
          detail: 'تم تحديث الفاتورة بنجاح',
        });
        this.dialogRef.close('refresh');
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في تحديث الفاتورة',
        });
      },
    });
  }
  // on init
  ngOnInit() {
    this.subscription = this.amountPaidSubject
      .pipe(
        debounceTime(600), // 1 second delay
        distinctUntilChanged()
      )
      .subscribe((event) => {
        this.onPaidChange(event);
      });
    this.getTenants();
  }

  // on cancel
  onCancel() {
    this.dialogRef.close();
  }
}
