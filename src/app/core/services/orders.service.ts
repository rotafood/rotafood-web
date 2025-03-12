import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { interval, Observable, switchMap } from 'rxjs';
import { CurrentUserService } from './current-user/current-user.service';
import { environment } from '../../../environments/environment';
import { OrderType } from '../interfaces/order-enum';
import { OrderStatus } from '../enums/order-status';
import { PaginationDto } from '../interfaces/pagination';
import { OrderDto } from '../interfaces/order';
import { FullOrderDto } from '../interfaces/full-order';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl: string = `${environment.ROTAFOOD_API}/v1/merchants`;

  constructor(
    private readonly http: HttpClient,
    private readonly currentUserService: CurrentUserService
  ) {}

  private getMerchantId(): string | undefined | null {
    return this.currentUserService.getCurrentUser()?.merchant.id;
  }

  /**
   * Obtém uma lista paginada de pedidos filtrados por tipo, status e data.
   */
  getAllOrders(
    orderTypes?: OrderType[],
    orderStatuses?: OrderStatus[],
    startDate?: string,
    endDate?: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Observable<PaginationDto<OrderDto>> {
    const merchantId = this.getMerchantId();
    if (!merchantId) throw new Error('Merchant ID is required');
  
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);
  
    if (orderTypes?.length) {
      params = params.set('orderTypes', orderTypes.join(','));
    }
    if (orderStatuses?.length) {
      params = params.set('orderStatuses', orderStatuses.join(','));
    }
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
  
    const url = `${this.apiUrl}/${merchantId}/orders`;
    return this.http.get<PaginationDto<OrderDto>>(url, { params });
  }

  startPollingOrders(): Observable<PaginationDto<FullOrderDto>> {
    const merchantId = this.getMerchantId();
    if (!merchantId) throw new Error('Merchant ID is required');

    return interval(15000).pipe(
      switchMap(() => {
        const url = `${this.apiUrl}/${merchantId}/orders/polling`;
        return this.http.get<PaginationDto<FullOrderDto>>(url);
      })
    );
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<void> {
    const merchantId = this.getMerchantId();
    if (!merchantId) throw new Error('Merchant ID is required');
  
    const url = `${this.apiUrl}/${merchantId}/orders/${orderId}/status`;
    return this.http.put<void>(url, null, { params: { status } });
  }
  

  /**
   * Obtém os detalhes de um pedido pelo ID.
   */
  getOrderById(orderId: string): Observable<OrderDto> {
    const merchantId = this.getMerchantId();
    if (!merchantId) throw new Error('Merchant ID is required');

    const url = `${this.apiUrl}/${merchantId}/orders/${orderId}`;
    return this.http.get<OrderDto>(url);
  }

  /**
   * Cria ou atualiza um pedido.
   */
  createOrUpdateOrder(order: OrderDto): Observable<OrderDto> {
    const merchantId = this.getMerchantId();
    if (!merchantId) throw new Error('Merchant ID is required');

    const url = `${this.apiUrl}/${merchantId}/orders`;
    return this.http.put<OrderDto>(url, order);
  }

  /**
   * Exclui um pedido pelo ID.
   */
  deleteOrder(orderId: string): Observable<void> {
    const merchantId = this.getMerchantId();
    if (!merchantId) throw new Error('Merchant ID is required');

    const url = `${this.apiUrl}/${merchantId}/orders/${orderId}`;
    return this.http.delete<void>(url);
  }
}
