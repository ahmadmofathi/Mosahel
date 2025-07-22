import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

if (environment.production) {
  enableProdMode();
  console.warn(`🚨 Console output is disabled on production!`);
  console.log = function (): void {};
  console.debug = function (): void {};
  console.warn = function (): void {};
  console.info = function (): void {};
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
