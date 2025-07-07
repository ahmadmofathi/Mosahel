import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SystemSettingsService } from '../../../core/services/system-settings.service';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-bill-details',
  standalone: true,
  imports: [CommonModule, NgxPrintModule],
  templateUrl: './bill-details.component.html',
  styleUrl: './bill-details.component.scss',
})
export class BillDetailsComponent {
  constructor(
    private dialogRef: MatDialogRef<BillDetailsComponent>,
    private system: SystemSettingsService,
    @Inject(MAT_DIALOG_DATA) public data: { bill: any }
  ) {}

  bill: any = null;
  ngOnInit(): void {
    this.system.getCompanySettings().subscribe((res: any) => {
      // Prepend base URL to relative image paths
      const logoUrl = this.getAbsoluteUrl(res.data.logoUrl);
      const stampUrl = this.getAbsoluteUrl(res.data.stampUrl);
      this.bill = { ...this.data.bill, ...res.data, logoUrl, stampUrl };
    });
  }

  private getAbsoluteUrl(relativeUrl: string): string {
    if (relativeUrl && !relativeUrl.startsWith('http')) {
      return `${environment.apiUrl}${relativeUrl}`;
    }
    return relativeUrl;
  }

  onCancel() {
    this.dialogRef.close(); // Close the dialog without submitting
  }
}
