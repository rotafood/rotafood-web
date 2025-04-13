import { Component, OnInit, OnDestroy } from '@angular/core';
import { FullOrderDto } from '../../../../core/interfaces/order/full-order';
import { Subscription, interval, switchMap } from 'rxjs';
import { OrderStatus, OrderTypeMap } from '../../../../core/interfaces/order/order-enum';
import { OrderService } from '../../../../core/services/orders.service';
import { MatDialog } from '@angular/material/dialog';
import { MerchantOrderEstimateDialogComponent } from '../../components/merchant-order-estimate-dialog/merchant-order-estimate-dialog.component';
import { MerchantService } from '../../../../core/services/merchant/merchant.service';
import { FullMerchantDto } from '../../../../core/interfaces/merchant/full-merchant';
import { ConfigurePrinterDialogComponent } from '../../components/configure-printer-dialog/configure-printer-dialog.component';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { OrderCreateOrUpdateComponent } from '../../components/order-create-or-update/order-create-or-update.component';

@Component({
  selector: 'app-orders-manager-page',
  templateUrl: './orders-manager-page.component.html',
  styleUrls: ['./orders-manager-page.component.scss']
})
export class OrdersManagerPageComponent implements OnInit, OnDestroy {
  public isOpen = false;
  public isMobile = false
  public allOrders: FullOrderDto[] = []
  public ordersCreated: FullOrderDto[] = [];
  public ordersInPreparation: FullOrderDto[] = [];
  public ordersReady: FullOrderDto[] = [];
  public OrderTypeMap = OrderTypeMap;
  public printCommands = false;
  public merchant!: FullMerchantDto;
  private pollingSubscription!: Subscription;


  constructor(
    private orderService: OrderService,
    private merchantService: MerchantService,
    private dialog: MatDialog,
    private windowService: WindowWidthService,

  ) {}

  ngOnInit(): void {
    this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);
    this.getOrderEstimates();
  }

  getOrderEstimates(): void {
    this.merchantService.get().subscribe((response) => {
      this.merchant = response;
    });
  }

  openEstimateDialog(): void {
    const dialogRef = this.dialog.open(MerchantOrderEstimateDialogComponent, {
      width: '400px',
      data: this.merchant
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.merchant = result
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

  startPollingOrders(): void {
    this.pollingSubscription = interval(15000)
      .pipe(switchMap(() => this.orderService.polling()))
      .subscribe(response => {
        this.sortOrders(response);
      });
  }

  openConfigurePrinter() {
    this.dialog.open(ConfigurePrinterDialogComponent, {
      width: '90%',
      height: '90%'
    });
  }

  createOrder() {
    this.dialog.open(OrderCreateOrUpdateComponent, {
      width: this.isMobile ? '100vw' : '90%' ,
      height: this.isMobile ? '100%' : '90%' ,
      data: {
        merchant: this.merchant
      }
    }).afterClosed().subscribe((value) => {
      this.sortOrders([...this.allOrders, value])
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
