import { Component } from '@angular/core';
import { OrderType } from '../../../../core/enums/order-type';
import { OrderStatus } from '../../../../core/enums/order-status';

@Component({
  selector: 'app-orders-list-page',
  templateUrl: './orders-list-page.component.html',
  styleUrl: './orders-list-page.component.scss'
})
export class OrdersListPageComponent {
  isLoading = false;
  activeTabIndex = 0;

  orderTypeOptions = [OrderStatus.ALL, OrderStatus.COMPLETED, OrderStatus.CONFIRMED, OrderStatus.CANCELED]

}
