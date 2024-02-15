import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';


export const KEY = 'ROTAFOOD_TOKEN';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private expirationTime: number | null = null;


  saveToken(token: string): void {
    localStorage.setItem(KEY, token)
    this.decodeToken()

  }

  deleteToken(): void {
    localStorage.removeItem(KEY)
    this.expirationTime = null
  }

  getToken(): string {
    return localStorage.getItem(KEY) ?? ''
  }


  decodeToken(): void {
    const { exp } = jwtDecode(this.getToken());
    this.expirationTime = exp!
  }
  
  hasToken(): boolean {
    this.hasExpired()
    return !!this.getToken();
  }

  
  hasExpired(): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    return this.expirationTime !== null && this.expirationTime < currentTime;
  }

  needRefresh(): boolean {
    const currentTime = Math.floor(Date.now() / 1000); 
    const refreshThreshold = this.expirationTime! - (this.expirationTime! * 0.5);
    return currentTime > refreshThreshold;
  }

}


