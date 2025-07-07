import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SystemSettingsService {
  constructor(private http: HttpClient) {}
  private api = `${environment.apiUrl}/api/CompanySetting`;

  saveSettings(settings: any) {
    console.log('Settings:', settings);

    // Create a FormData object
    const formData = new FormData();

    // Append non-file settings to the FormData object
    for (const key in settings) {
      if (settings.hasOwnProperty(key)) {
        // Check if the value is a File object
        if (settings[key] instanceof File) {
          formData.append(key, settings[key], settings[key].name);
        } else {
          // Append non-file data as strings
          formData.append(key, settings[key]);
        }
      }
    }

    // Append the logo file (binary data)
    if (settings.logoUrl instanceof File) {
      formData.append('Logo', settings.logoUrl, settings.logoUrl.name);
    } else {
      console.warn('logoUrl is not a File object:', settings.logoUrl);
    }

    // Append the stamp file (binary data)
    if (settings.stampUrl instanceof File) {
      formData.append('Stamp', settings.stampUrl, settings.stampUrl.name);
    } else {
      console.warn('stampUrl is not a File object:', settings.stampUrl);
    }

    // Send the request with FormData
    return this.http.post(this.api + '/UpdateCompanySettings', formData);
  }

  // Get company settings
  getCompanySettings() {
    return this.http.get(this.api + '/GetCompanySettings');
  }
}
