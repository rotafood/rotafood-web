import { Component, OnInit, OnDestroy } from '@angular/core';
import { FullOrderDto } from '../../../../core/interfaces/full-order';
import { Subscription } from 'rxjs';
import { OrderStatus } from '../../../../core/interfaces/order-enum';
import { OrderService } from '../../../../core/services/orders.service';

@Component({
  selector: 'app-orders-manager-page',
  templateUrl: './orders-manager-page.component.html',
  styleUrls: ['./orders-manager-page.component.scss']
})
export class OrdersManagerPageComponent implements OnInit, OnDestroy {
  public isOpen = false;
  public ordersCreated: FullOrderDto[] = [];
  public ordersInPreparation: FullOrderDto[] = [];
  public ordersReady: FullOrderDto[] = [];
  private pollingSubscription!: Subscription;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.startPollingOrders();
  }

  toggleStoreStatus() {
    this.isOpen = !this.isOpen
  }

  /**
   * Inicia o Polling para atualizar pedidos automaticamente.
   */
  startPollingOrders(): void {
    this.pollingSubscription = this.orderService.startPollingOrders().subscribe(response => {
      this.ordersCreated = response.data.filter(order => order.status === OrderStatus.CREATED);
      this.ordersInPreparation = response.data.filter(order => order.status === OrderStatus.PREPARATION_STARTED);
      this.ordersReady = response.data.filter(order => order.status === OrderStatus.READY_TO_PICKUP);
    });
  }

  /**
   * Atualiza o status do pedido para o próximo estágio.
   */
  nextOrderStatus(order: FullOrderDto): void {
    const statusFlow = [
      OrderStatus.CREATED,
      OrderStatus.CONFIRMED,
      OrderStatus.PREPARATION_STARTED,
      OrderStatus.READY_TO_PICKUP,
      OrderStatus.DISPATCHED,
      OrderStatus.COMPLETED
    ];

    const currentIndex = statusFlow.indexOf(order.status);
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) return;

    const newStatus = statusFlow[currentIndex + 1];

    this.orderService.updateOrderStatus(order.id!, newStatus).subscribe(() => {
      this.startPollingOrders();
    });
  }

  /**
   * Cancela o polling quando o componente for destruído.
   */
  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}
