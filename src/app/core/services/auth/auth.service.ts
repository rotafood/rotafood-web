import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CreateMerchant, Merchant, User } from '../../interfaces/merchant';
import { CurrentlyUserService } from '../currently-user/currently-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = environment.ROTAFOOD_API;
  constructor(
    private http: HttpClient,
    private currentlyUserService: CurrentlyUserService
    ) { }

  createMerchant(merchant: Merchant, user: User): Observable<CreateMerchant|any> {
    const url = `${this.apiUrl}/auth/merchants/create/`;
    const data = {
      'merchant': merchant,
      'user': user
    }

    console.log(data)
    
    return this.http.post<CreateMerchant|any>(url, data, { observe: 'response' }).pipe(
      tap(response => {
        const authToken = response.body?.accessToken;
        if (authToken) {
          this.currentlyUserService.saveToken(authToken);
        }
      })
    );
  }
}
