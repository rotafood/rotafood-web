import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CurrentUserService } from '../current-user/current-user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly apiUrl: string = `${environment.ROTAFOOD_API}/v1/merchants`;

  constructor(
    private readonly http: HttpClient,
    private readonly currentUserService: CurrentUserService
  ) {}

  private getMerchantId(): string | undefined | null {
    return this.currentUserService.getCurrentUser()?.merchant.id;
  }

  public delete(id: string): Observable<void> {
    const merchantId = this.getMerchantId();
    if (!merchantId) {
      throw new Error('Merchant ID is not available');
    }
    const url = `${this.apiUrl}/${merchantId}/products/${id}`;
    return this.http.delete<void>(url);
  }

}
