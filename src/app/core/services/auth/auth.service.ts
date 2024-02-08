import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateMerchant, Merchant, User } from '../../interfaces/merchant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = environment.ROTAFOOD_API;
  constructor(private http: HttpClient) { }

  createMerchant(merchant: Merchant, user: User): Observable<CreateMerchant|any> {
    const url = `${this.apiUrl}/auth/merchants/create/`;
    const data = {
      merchant: merchant,
      user: user
    }
    
    return this.http.post(url, data);
  }
}
