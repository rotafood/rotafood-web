import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FullOrderDto } from '../interfaces/full-order';

@Injectable({
  providedIn: 'root'
})
export class CatalogOnlineOrderService {

  private orderSubject = new BehaviorSubject<FullOrderDto | null>(null);
  order$ = this.orderSubject.asObservable();

  setOrder(order: FullOrderDto) {
    this.orderSubject.next(order);
  }

  getOrder(): FullOrderDto | null {
    return this.orderSubject.getValue();
  }

  clearOrder() {
    this.orderSubject.next(null);
  }
}