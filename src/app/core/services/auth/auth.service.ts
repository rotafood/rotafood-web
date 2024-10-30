import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {  Merchant } from '../../interfaces/merchant';
import { CurrentlyUserService } from '../currently-user/currently-user.service';
import { Token } from '@angular/compiler';
import { AuthToken, MerchantOwnerCreation, Login, User } from '../../interfaces/auth';
import { MerchantCreate } from '../../interfaces/merchant-create';
import { OwnerCreate } from '../../interfaces/owner-create';

@Injectable({
  providedIn: 'root'
})
export class AuthService {



  private apiUrl: string = environment.ROTAFOOD_API;
  constructor(
    private http: HttpClient,
    private currentlyUserService: CurrentlyUserService
    ) { }

  createMerchant(merchantOwnerCreation: MerchantOwnerCreation): Observable<Token|any> {
    const url = `${this.apiUrl}/v1/auth/sigin`;
    
    return this.http.post<Token|any>(url, merchantOwnerCreation, { observe: 'response' }).pipe(
      tap(response => {
        const authToken = response.body?.accessToken;
        if (authToken) {
          this.currentlyUserService.saveToken(authToken);
        }
      })
    );
  }

  login(Login: Login): Observable<AuthToken|any> {
    const url = `${this.apiUrl}/v1/auth/login`;

    return this.http.post<Token|any>(url, Login, { observe: 'response' }).pipe(
      tap(response => {
        const authToken = response.body?.accessToken;
        if (authToken) {
          this.currentlyUserService.saveToken(authToken);
        }
      })
    );
  }

  refreshToken():void {
    const url = `${this.apiUrl}/auth/refresh_token/`;
    this.http.post<Token|any>(url, { observe: 'response' }).pipe(
      tap(response => {
        const authToken = response.body?.accessToken;
        if (authToken) {
          this.currentlyUserService.saveToken(authToken);
        } else {
          this.currentlyUserService.logout()
        }
      })
    );

  }
}
