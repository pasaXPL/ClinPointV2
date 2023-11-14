import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from './../Models/model.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) { }

  setToken(token: string, expirationMinutes: number = 60): void {
    const expirationMs = expirationMinutes * 60 * 1000; // Convert minutes to milliseconds
    const expirationTime = new Date().getTime() + expirationMs;

    localStorage.setItem('clinicPointToken', token);
    localStorage.setItem('clinicPointTokenExpiration', expirationTime.toString());
  }

  setAuth(token: string): void{
    localStorage.setItem('clinicPointAuth', token)
  }

  getToken():string | null {
    const token = localStorage.getItem('clinicPointToken');
    const expirationTime = localStorage.getItem('clinicPointTokenExpiration');

    if (!token || !expirationTime) {
        return null;
    }
    else{
      const currentTimestamp = new Date().getTime();
      const expirationTimestamp = parseInt(expirationTime, 10);

      if (currentTimestamp > expirationTimestamp) {
        localStorage.removeItem('clinicPointToken');
        localStorage.removeItem('clinicPointTokenExpiration');
        localStorage.removeItem('clinicPointAuth');
        return null;
      }
      else{
        return token;
      }
    }
  }

  getAuth(): string | null{
    return localStorage.getItem('clinicPointAuth');
  }

  isLoggedIn(){
    return this.getToken() !== null;
  }

  logout(){
    localStorage.removeItem('clinicPointToken');
    localStorage.removeItem('clinicPointTokenExpiration');
    localStorage.removeItem('clinicPointAuth');
    this.router.navigate(['/accounts/login']);
  }

  loginUser(account: Account){
    this.setAuth(account.role);
    this.setToken(account.id, 60);
    this.router.navigate(['dashboard']);
  }
}
