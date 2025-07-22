// token.service.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUserInfo(token: string): any {
    const decoded = this.decodeToken(token);
    localStorage.setItem('tenantName', decoded?.given_name);
    // console.log(decoded);
    return decoded ? decoded : null;
  }

  setRole() {
    const currentUser = localStorage.getItem('currentUser');
    const token = currentUser ? JSON.parse(currentUser).token : ''; // Replace with your storage method
    const roleInfo = this.getUserInfo(token).role;
    localStorage.setItem('role', roleInfo);
  }
}
