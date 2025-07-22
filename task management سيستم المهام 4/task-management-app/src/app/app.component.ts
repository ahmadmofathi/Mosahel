import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/layout/navbar/navbar.component';
import { SidebarComponent } from './shared/layout/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TopBar } from './shared/layout/top-bar/top-bar.component';
import { NavBar } from './shared/layout/navigation/navigation.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { ChatbotComponent } from './shared/layout/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    TranslateModule,
    TopBar,
    NavBar,
    FooterComponent,
    ChatbotComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  authService = inject(AuthService);
  isAuth: boolean = false;
  isLoading: boolean = false;
  title = 'task-management-app';
  isHomeRoute: boolean = false;
  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((res) => {
      this.isAuth = res;
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 30);
    this.getLanguageBrowser();
  }

  isRobot: boolean = true;
  toggleRobot() {
    this.isRobot = !this.isRobot;
  }
  getLanguageBrowser() {
    const browserLang = this.translate.getBrowserLang();
    const lang = localStorage.getItem('language') ?? browserLang;
    if (lang) {
      const matched = lang.match(/en|ar/) ? lang : 'en';
      this.translate.use(matched);
      document.documentElement.lang = matched;
      document.documentElement.dir = matched === 'ar' ? 'rtl' : 'ltr';
    }
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  constructor(private translate: TranslateService, private router: Router) {
    translate.setDefaultLang('en');
    translate.addLangs(['en', 'ar']);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Current URL:', this.router.url); // ✅ Logs the correct URL
        console.log(this.router.url);
        this.isHomeRoute = this.isHomeRoute =
          this.router.url === '/' ||
          this.router.url === '/#about' ||
          this.router.url === '/#whyUs' ||
          this.router.url === '/#packages' ||
          this.router.url === '' ||
          this.router.url === '/employeer' ||
          this.router.url === '/services';
      }
    });
  }
}
