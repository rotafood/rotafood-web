import { Component, OnInit, OnDestroy } from '@angular/core';
import { FullOrderDto } from '../../../../core/interfaces/full-order';
import { Subscription, interval, switchMap } from 'rxjs';
import { OrderStatus, OrderTypeMap } from '../../../../core/interfaces/order-enum';
import { OrderService } from '../../../../core/services/orders.service';
import { LogisticService } from '../../../../core/services/logistic.service';
import { MerchantOrderEstimateDto } from '../../../../core/interfaces/merchant-order-estimate';
import { MatDialog } from '@angular/material/dialog';
import { MerchantOrderEstimateDialogComponent } from '../../components/merchant-order-estimate-dialog/merchant-order-estimate-dialog.component';

@Component({
  selector: 'app-orders-manager-page',
  templateUrl: './orders-manager-page.component.html',
  styleUrls: ['./orders-manager-page.component.scss']
})
export class OrdersManagerPageComponent implements OnInit, OnDestroy {
  public isOpen = false;
  public allOrders: FullOrderDto[] = []
  public ordersCreated: FullOrderDto[] = [];
  public ordersInPreparation: FullOrderDto[] = [];
  public ordersReady: FullOrderDto[] = [];
  public OrderTypeMap = OrderTypeMap;
  public printCommands = false;
  public orderEstimates!: MerchantOrderEstimateDto;
  private pollingSubscription!: Subscription;


  constructor(
    private orderService: OrderService,
    private logisticService: LogisticService,
    private dialog: MatDialog

  ) {}

  ngOnInit(): void {
    this.getOrderEstimates();
    this.toggleStoreStatus();
  }

  getOrderEstimates(): void {
    this.logisticService.getMerchantOrderEstimates().subscribe((estimates) => {
      this.orderEstimates = estimates;
    });
  }

  openEstimateDialog(): void {
    const dialogRef = this.dialog.open(MerchantOrderEstimateDialogComponent, {
      width: '400px',
      data: this.orderEstimates
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderEstimates = result
      }
    });
  }

  toggleStoreStatus() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.orderService.polling().subscribe({
        next: (response) => {
          this.sortOrders(response);
        }
      })

      this.startPollingOrders()
    }
  }

  togglePrintCommands() {
    const token = localStorage.getItem('ROTAFOOD_TOKEN');
  
    if (!token) {
      console.log('Nenhum token encontrado no Local Storage.');
      return;
    }
  
    navigator.clipboard.writeText(token)
      .then(() => {
        console.log('Token copiado para o clipboard!');
      })
      .catch((err) => {
        console.error('Falha ao copiar token:', err);
      });
  }
  

  startPollingOrders(): void {
    this.pollingSubscription = interval(150000)
      .pipe(switchMap(() => this.orderService.polling()))
      .subscribe(response => {
        this.sortOrders(response);
      });
  }

  sortOrders(orders: FullOrderDto[]) {
    this.allOrders = orders;
    this.ordersCreated = orders.filter(order => order.status === OrderStatus.CREATED || order.status === OrderStatus.CONFIRMED);
    this.ordersInPreparation = orders.filter(order => order.status === OrderStatus.PREPARATION_STARTED);
    this.ordersReady = orders.filter(order => order.status === OrderStatus.READY_TO_PICKUP);  
  }

  nextOrderStatus(order: FullOrderDto): void {
    const statusFlow = [
      OrderStatus.CREATED,
      OrderStatus.CONFIRMED,
      OrderStatus.PREPARATION_STARTED,
      OrderStatus.READY_TO_PICKUP,
      OrderStatus.DISPATCHED,
      OrderStatus.COMPLETED
    ];
  
    let newStatus: OrderStatus;
  
    if (order.status === OrderStatus.CREATED || order.status === OrderStatus.CONFIRMED) {
      newStatus = OrderStatus.PREPARATION_STARTED;
      
      this.orderService.updateOrderStatus(order.id!, newStatus).subscribe(() => {
        order.status = newStatus;
        this.sortOrders(this.allOrders);
      });
    } else {
      const currentIndex = statusFlow.indexOf(order.status);
      if (currentIndex === -1 || currentIndex === statusFlow.length - 1) return;
      newStatus = statusFlow[currentIndex + 1]; //  OrderStatus.CREATED //
  
      this.orderService.updateOrderStatus(order.id!, newStatus).subscribe(() => {
        order.status = newStatus;
        this.sortOrders(this.allOrders);
      });
    }
  }

  
  
  cancelOrder(order: FullOrderDto): void {
    if (!order || order.status === OrderStatus.CANCELED) return;
  
    const newStatus = OrderStatus.CANCELED;
  
    this.orderService.updateOrderStatus(order.id!, newStatus).subscribe(() => {
      order.status = newStatus;
      this.sortOrders(this.allOrders);
    });
  }
  



  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}
