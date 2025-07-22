import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TenantsService } from '../../../../core/services/tenants';
import { AuthService } from '../../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-tenant-profile',
  standalone: true,
  imports: [  ],
  templateUrl: './tenant-profile.component.html',
  styleUrl: './tenant-profile.component.scss'
})
export class TenantProfileComponent implements OnInit {
  tenant: any = {
    id: "",
    tenantName: "",
    email: "",
    password: "",
    startDate: "",
    endDate: "",
    phoneNumber: "",
    subscriptionFee: 0,
    expirationDate: "",
    notes: "",
    status: ""
  };
  fields = [
    // { id: 'tenantName', label: 'اسم الشركة', property: 'tenantName' },
    { id: 'phone', label: 'رقم الجوال', property: 'phoneNumber' },
    { id: 'email', label: 'البريد الإلكتروني', property: 'email' },
    { id: 'startDate', label: 'تاريخ بدء الاشتراك', property: 'startDate', value: new Date(this.tenant.startDate).toLocaleDateString() },
    { id: 'endDate', label: 'تاريخ انتهاء الاشتراك', property: 'endDate', value: new Date(this.tenant.endDate).toLocaleDateString() },
    { id: 'subscriptionFee', label: 'قيمة الاشتراك', property: 'subscriptionFee' },
    { id: 'employeeCount', label: 'عدد الموظفين', property: 'employeeCount' }
  ];

  @ViewChild('fileInput') fileInput!: ElementRef;

  profileId:any;
  token:any;
  constructor(
    private tenantService:TenantsService,
    private authService:AuthService,
    private snackBar: MatSnackBar
  ) {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.token = this.authService.decodeToken(token.token);
    this.profileId = this.token.tenantId;
  }

  count:any;
  ngOnInit(): void {
    this.tenantService.getById(this.profileId).subscribe((res)=>{
      this.tenant = res;
      if(this.tenant.logoUrl) this.profilePicture = `${environment.apiUrl}${this.tenant.logoUrl}`;
    })
  }
  profilePicture: string = 'images/company-profile.svg';

  
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Optional: show preview in the UI
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicture = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Call the service to update the tenant's logo
      this.tenantService.updateLogo(this.profileId, file).subscribe({
        next: (response) => {
          this.snackBar.open(
            response.message,
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        },
        error: (err) => {
          console.error('Error updating logo: ', err);
          this.snackBar.open(
            err.message,
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        },
      });
    }
  }
}
