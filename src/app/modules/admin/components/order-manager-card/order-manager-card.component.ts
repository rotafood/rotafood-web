import { Component, Input } from '@angular/core';
import { FullOrderDto } from '../../../../core/interfaces/order/full-order';
import { OrderTypeMap } from '../../../../core/interfaces/order/order-enum';
import { printOrderTicket } from '../../../../core/helpers/print-ordeer-tecket';
import { OrdersService } from '../../../../core/services/orders/orders.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-order-manager-card',
  templateUrl: './order-manager-card.component.html',
  styleUrl: './order-manager-card.component.scss'
})
export class OrderManagerCardComponent {

  @Input()
  order?: FullOrderDto

  OrderTypeMap = OrderTypeMap

  constructor(private ordersService: OrdersService, private snackbar: MatSnackBar) {}

  printOrder(order: FullOrderDto) {
    console.log(order)
    this.ordersService.printOrder(order.id as string).subscribe({
      next: () => {
        this.snackbar.open('Pedido enviado para impressão!', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

}
