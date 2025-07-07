import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    // Check localStorage on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => !!user));
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap((user: any) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  requestPass(formData: any) {
    return this.http.post(`${this.baseUrl}/api/support`, {
      ...formData,
      issueType: 1,
      fullname: formData.email,
    });
  }

  newPassword(newPassDto: any): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/Auth/change-password`, {
        ...newPassDto,
      })
      .pipe(
        tap(() => {
          this.snackBar.open(
            'تم تغير الرقم السري بنجاح اعد التسجيل ✅✅',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            }
          );
          setTimeout(() => {}, 2000);
          this.logout();
        })
      );
  }

  refreshToken(tokens: {
    refreshToken: string;
    token: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/refresh`, {
      refreshToken: tokens.refreshToken,
      token: tokens.token,
    });
  }

  logout(): void {
    // this.http.post<any>(`${this.baseUrl}/auth/logout`, {});
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }
}
