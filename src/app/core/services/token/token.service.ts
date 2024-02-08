import { Injectable } from '@angular/core';


export const KEY = 'ROTAFOOD_TOKEN';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  saveToken(token: string) {
    return localStorage.setItem(KEY, token)
  }

  deleteToken() {
    localStorage.removeItem(KEY)
  }

  getToken() {
    return localStorage.getItem(KEY) ?? ''
  }
  
  hasToken() {
    return !!this.getToken();
  }
}
