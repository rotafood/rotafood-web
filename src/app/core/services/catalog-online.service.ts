import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MerchantAndCategoriesDto } from '../interfaces/merchant-and-categories';
import { MerchantDto } from '../interfaces/merchant';
import { FullOrderDto } from '../interfaces/full-order';


@Injectable({
  providedIn: 'root'
})
export class CatalogOnlineService {
  private readonly apiUrl: string = `${environment.ROTAFOOD_API}/v1/catalogs/online`;

  constructor(
    private readonly http: HttpClient,
  ) {}

  public getCatalogByOnlineName(onlineName: string): Observable<MerchantAndCategoriesDto> {
    const url = `${this.apiUrl}/${onlineName}/categories`;
    return this.http.get<MerchantAndCategoriesDto>(url);
  }

  public getMerchantByOnlineName(onlineName: string): Observable<MerchantDto> {
    const url = `${this.apiUrl}/${onlineName}`;
    return this.http.get<MerchantDto>(url);
  }


  getOrderById(onlineName: string, orderId: string): Observable<FullOrderDto> {
      const url = `${this.apiUrl}/${onlineName}/orders/${orderId}`;
      return this.http.get<FullOrderDto>(url);
    }
  

  createOrder(onlineName: string, order: FullOrderDto): Observable<FullOrderDto> {
    console.log(order)
    const url = `${this.apiUrl}/${onlineName}/orders`;
    return this.http.put<FullOrderDto>(url, order);
  }
  
}
