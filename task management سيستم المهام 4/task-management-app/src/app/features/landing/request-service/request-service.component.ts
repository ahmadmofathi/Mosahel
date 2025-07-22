import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ImproveServiceComponent } from './components/improve-service/improve-service.component';
import { OrderComponent } from './components/order/order.component';

@Component({
  selector: 'app-request-service',
  standalone: true,
  imports: [TranslateModule, ImproveServiceComponent, OrderComponent],
  templateUrl: './request-service.component.html',
  styleUrl: './request-service.component.scss',
})
export class RequestServiceComponent {}
