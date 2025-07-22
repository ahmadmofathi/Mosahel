import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ImproveEmpComponent } from './components/improve-emp/improve-emp.component';
import { ApplyJobComponent } from './components/apply-job/apply-job.component';

@Component({
  selector: 'app-employment',
  standalone: true,
  imports: [TranslateModule, ApplyJobComponent],
  templateUrl: './employment.component.html',
  styleUrl: './employment.component.scss',
})
export class EmploymentComponent {}
