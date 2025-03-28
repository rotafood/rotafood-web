import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MerchantAndMenuUrlDto } from '../interfaces/merchant-and-manu-url';
import { FullMerchantDto } from '../interfaces/full-merchant';
import { FullOrderDto } from '../interfaces/full-order';
import { FullCategoryDto } from '../interfaces/category';
import { AddressDto } from '../interfaces/address';
import { DistanceOutDto } from '../interfaces/distance-out';


@Injectable({
  providedIn: 'root'
})
export class CatalogOnlineService {
  private readonly apiUrl: string = `${environment.ROTAFOOD_API}/v1/catalogs/online`;

  constructor(
    private readonly http: HttpClient,
  ) {}

  public getCatalogByOnlineName(onlineName: string): Observable<MerchantAndMenuUrlDto> {
    const url = `${this.apiUrl}/${onlineName}/categories`;
    return this.http.get<MerchantAndMenuUrlDto>(url);
  }

  public getMerchantByOnlineName(onlineName: string): Observable<FullMerchantDto> {
    const url = `${this.apiUrl}/${onlineName}`;
    return this.http.get<FullMerchantDto>(url);
  }


  public getOrderById(onlineName: string, orderId: string): Observable<FullOrderDto> {
      const url = `${this.apiUrl}/${onlineName}/orders/${orderId}`;
      return this.http.get<FullOrderDto>(url);
    }

  public createOrder(onlineName: string, order: FullOrderDto): Observable<FullOrderDto> {
    const url = `${this.apiUrl}/${onlineName}/orders`;
    return this.http.put<FullOrderDto>(url, order);
  }

  public getCategoriesFromUrl(menuUrl: string): Observable<FullCategoryDto[]> {
    const url = `${menuUrl}?cb=${Date.now()}`;
    return this.http.get<FullCategoryDto[]>(url);
  }

  public getDistance(onlineName: string, address: AddressDto) {
    const url = `${this.apiUrl}/${onlineName}/distances`;
    return this.http.post<DistanceOutDto>(url, address);
  }
  
}
