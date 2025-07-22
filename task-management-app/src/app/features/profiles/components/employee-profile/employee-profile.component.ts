import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../../core/services/employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss'
})
export class EmployeeProfileComponent implements OnInit {
  employee: any = {
    id: "",
    fullName: "",
    jobNumber: "",
    company: "",
    email: "",
    phoneNumber: "",
    nationality: "",
    nationalId: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    createdOn: "",
    tenantName: "",
    password: "",
    identityNumber: ""
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
  profilePicture: string = 'images/man-profile.svg';

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
