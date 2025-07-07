import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  currentTitle: string = 'الرئيسية';
  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentTitle = this.titleService.getTitle();
      });
  }

  headerName: string = '';
  idNo: string = '';
  getHeaderName() {
    if (this.currentRole === 'Admin') {
      this.headerName = localStorage.getItem('tenantName') ?? '';
    } else if (['SuperAdmin', 'OperationsManager'].includes(this.currentRole)) {
      this.headerName = 'شركة الوثق العربي لخدمات الاعمال';
    } else {
      const currentUser = localStorage.getItem('currentUser');
      this.headerName = currentUser
        ? JSON.parse(currentUser).fullName ?? JSON.parse(currentUser).userName
        : '';
      if(this.currentRole =='Employee') this.idNo = JSON.parse(currentUser!).email;
    }
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        this.currentTitle = data['title'] || 'Task Managment';
        this.titleService.setTitle(this.currentTitle);
      });

    this.getHeaderName();
  }

  currentRole = localStorage.getItem('role') ?? '';

  logout() {
    this.authService.logout();
  }
}
