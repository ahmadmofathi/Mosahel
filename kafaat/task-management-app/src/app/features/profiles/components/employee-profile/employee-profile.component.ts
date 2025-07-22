import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../../core/services/employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss'
})
export class EmployeeProfileComponent implements OnInit {
  employee: any = {
    id: "12345",
    fullName: "محمد علي خالد عبدالله",
    jobNumber: "376452873742",
    company: "الشركة المصرية الدولية للمقاولات",
    email: "admin@admin.com",
    phoneNumber: "2376483465937",
    nationality: "مصر",
    nationalId: "7834568324563",
    jobTitle: "محاسب مالي",
    startDate: "2025-03-11T23:48:09.253Z",
    endDate: "2025-03-11T23:48:09.253Z",
    createdOn: "2025-03-11T23:48:09.253Z",
    tenantName: "Tenant 1",
    password: "password123",
    identityNumber: "7834568324563"
  };
  
  fields = [
    { id: 'company', label: 'اسم الشركة', property: 'company' },
    { id: 'phone', label: 'رقم الجوال', property: 'phoneNumber' },
    { id: 'email', label: 'البريد الإلكتروني', property: 'email' },
    { id: 'manager', label: 'المدير المباشر', property: 'managerName', value: 'أسامه أحمد علي' }, // Static value
    { id: 'joinDate', label: 'تاريخ الإنضمام', property: 'createdOn', value: new Date(this.employee.createdOn).toLocaleDateString() },
    { id: 'nationalId', label: 'رقم الهوية', property: 'identityNumber' },
    { id: 'jobNumber', label: 'الرقم الوظيفي', property: 'jobNumber' },
    { id: 'jobTitle', label: 'المسمى الوظيفي', property: 'jobTitle' }
  ];

  lastFields = [
    { id: 'nationalId', label: 'رقم الهوية', property: 'identityNumber' },
    { id: 'jobNumber', label: 'الرقم الوظيفي', property: 'jobNumber' },
    { id: 'jobTitle', label: 'المسمى الوظيفي', property: 'jobTitle' }
  ];
  profileId:any;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private employeeService:EmployeeService,
    private snackBar:MatSnackBar
  ) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      this.profileId = currentUser.id;
      console.log(this.profileId);
  }

  ngOnInit(): void {
    this.employeeService.getById(this.profileId).subscribe((res)=>{
      this.employee = res;
      if(this.employee.profilePicture) this.profilePicture = `${environment.apiUrl}${this.employee.profilePicture}`;
      console.log(res)
    })
  }
  profilePicture: string = 'images/man-profile.jpg';

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
      this.employeeService.updateProfilePic(this.profileId, file).subscribe({
        next: (response) => {
          console.log(response)
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
