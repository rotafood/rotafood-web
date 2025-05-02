import { Component, OnInit, OnDestroy } from '@angular/core';
import { FullOrderDto } from '../../../../core/interfaces/order/full-order';
import { Subscription, interval, switchMap } from 'rxjs';
import { OrderStatus, OrderTypeMap } from '../../../../core/interfaces/order/order-enum';
import { OrderService } from '../../../../core/services/orders.service';
import { MatDialog } from '@angular/material/dialog';
import { MerchantService } from '../../../../core/services/merchant/merchant.service';
import { FullMerchantDto } from '../../../../core/interfaces/merchant/full-merchant';
import { ConfigurePrinterDialogComponent } from '../../components/configure-printer-dialog/configure-printer-dialog.component';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { OrderCreateOrUpdateComponent } from '../../components/order-create-or-update/order-create-or-update.component';
import { MerchantOrderEstimateDialogComponent } from '../../components/merchant-order-estimate-dialog/merchant-order-estimate-dialog.component';

@Component({
  selector: 'app-orders-manager-page',
  templateUrl: './orders-manager-page.component.html',
  styleUrls: ['./orders-manager-page.component.scss']
})
export class OrdersManagerPageComponent implements OnInit, OnDestroy {
  public isOpen = false;
  public autoAccept = false;
  public isMobile = false;
  public allOrders: FullOrderDto[] = [];
  public ordersCreated: FullOrderDto[] = [];
  public ordersInPreparation: FullOrderDto[] = [];
  public ordersReady: FullOrderDto[] = [];
  public OrderTypeMap = OrderTypeMap;

  public merchant!: FullMerchantDto;
  private pollingSubscription?: Subscription;

  constructor(
    private orderService: OrderService,
    private merchantService: MerchantService,
    private dialog: MatDialog,
    private windowService: WindowWidthService
  ) {}

  ngOnInit(): void {
    this.windowService.isMobile().subscribe(isM => this.isMobile = isM);

    this.merchantService.get().subscribe({
      next: merchant => {
        this.merchant = merchant;
        const lastOpen = new Date(merchant.lastOpenedUtc).getTime();
        this.isOpen = (Date.now() - lastOpen) < 30000;

        if (this.isOpen) {
          this.loadAndStartPolling();
        }
      },
      error: err => console.error('Erro ao buscar merchant:', err)
    });
  }

  toggleAutoAccept(): void {
    this.autoAccept = !this.autoAccept;
    if (this.autoAccept && this.ordersCreated.length) {
      this.acceptAllOrders();
    }
  }

  toggleStoreStatus(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.loadAndStartPolling();
    } else {
      this.stopPolling();
      this.orderService.stopPolling().subscribe({
        next: () => console.log('Backend notificado: stopPolling'),
        error: e => console.error('Erro em stopPolling():', e)
      });
    }
  }

  private loadAndStartPolling(): void {
    this.orderService.polling().subscribe({
      next: resp => this.sortOrders(resp),
      error: e => console.error('Erro no polling inicial:', e)
    });
    this.startPolling();
  }

  private startPolling(): void {
    if (this.pollingSubscription) { return; }

    this.pollingSubscription = interval(15000)
      .pipe(switchMap(() => this.orderService.polling()))
      .subscribe({
        next: resp => this.sortOrders(resp),
        error: e => {
          console.error('Erro no polling periódico:', e);
          this.stopPolling();
        }
      });
  }

  stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = undefined;
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
    
    if (this.autoAccept) {
      this.acceptAllOrders();
    }
  }

  private acceptAllOrders(): void {
    const toAccept = this.ordersCreated.slice(); 
    toAccept.forEach(order => {
      this.orderService
        .updateOrderStatus(order.id!, OrderStatus.PREPARATION_STARTED)
        .subscribe({
          next: () => {
            order.status = OrderStatus.PREPARATION_STARTED;
            this.sortOrders(this.allOrders);
          },
          error: err =>
            console.error('Erro ao auto-aceitar pedido', order.id, err)
        });
    });
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
  

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}

