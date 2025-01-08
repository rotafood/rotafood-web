import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CurrentUserService } from '../current-user/current-user.service';
import { MerchantDto } from '../../interfaces/merchant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  private readonly apiUrl: string = `${environment.ROTAFOOD_API}/v1/merchants`;

  constructor(
    private readonly http: HttpClient,
    private readonly CurrentUserService: CurrentUserService
  ) {}

  private getMerchantId(): string | undefined | null {
    return this.CurrentUserService.getCurrentUser()?.merchant.id;
  }
  public get(): Observable<MerchantDto> {
    const merchantId = this.getMerchantId()
    const url = `${this.apiUrl}/${merchantId}`;
    return this.http.get<MerchantDto>(url);
  }

  public update(merchant: MerchantDto): Observable<MerchantDto> {
    const merchantId = this.getMerchantId()
    const url = `${this.apiUrl}/${merchantId}`;
    return this.http.put<MerchantDto>(url, merchant);
  }
}
