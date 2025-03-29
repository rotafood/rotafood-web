import { Component, Input } from '@angular/core';
import { FullOrderDto } from '../../../../core/interfaces/order/full-order';
import { OrderTypeMap } from '../../../../core/interfaces/order/order-enum';
import { printOrderTicket } from '../../../../core/helpers/print-ordeer-tecket';


@Component({
  selector: 'app-order-manager-card',
  templateUrl: './order-manager-card.component.html',
  styleUrl: './order-manager-card.component.scss'
})
export class OrderManagerCardComponent {

  @Input()
  order?: FullOrderDto

  OrderTypeMap = OrderTypeMap

  printOrder(order: FullOrderDto) {
    printOrderTicket(order);
  }

}
