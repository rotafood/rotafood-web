import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MerchantAndCategoriesDto } from '../interfaces/merchant-and-categories';
import { ItemDto } from '../interfaces/item';


@Injectable({
  providedIn: 'root'
})
export class CatalogOnlineService {
  private readonly apiUrl: string = `${environment.ROTAFOOD_API}/v1/catalogs`;

  constructor(
    private readonly http: HttpClient,
  ) {}

  public getCatalogByOnlineName(onlineName: string): Observable<MerchantAndCategoriesDto> {
    const url = `${this.apiUrl}/${onlineName}`;
    return this.http.get<MerchantAndCategoriesDto>(url);
  }

  addToCart(item: ItemDto) {
    console.log('Produto adicionado ao carrinho:', item.product.name);
    // Aqui você pode chamar um service para adicionar ao carrinho
  }
}
