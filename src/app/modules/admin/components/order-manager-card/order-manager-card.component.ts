import { Component, Input } from '@angular/core';
import { FullOrderDto } from '../../../../core/interfaces/order/full-order';
import { OrderTypeMap } from '../../../../core/interfaces/order/order-enum';
import { printOrderTicket } from '../../../../core/helpers/print-ordeer-tecket';
import { OrdersService } from '../../../../core/services/orders/orders.service';


@Component({
  selector: 'app-order-manager-card',
  templateUrl: './order-manager-card.component.html',
  styleUrl: './order-manager-card.component.scss'
})
export class OrderManagerCardComponent {

  @Input()
  order?: FullOrderDto

  OrderTypeMap = OrderTypeMap

  constructor(private ordersService: OrdersService) {}

  printOrder(order: FullOrderDto) {
    this.ordersService.printOrder(order.id as string);
  }

}
