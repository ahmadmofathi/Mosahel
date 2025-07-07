import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/layout/navbar/navbar.component';
import { SidebarComponent } from './shared/layout/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  authService = inject(AuthService);
  isAuth: boolean = false;
  title = 'task-management-app';
  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((res) => {
      this.isAuth = res;
    });
  }

  constructor() {}
}
