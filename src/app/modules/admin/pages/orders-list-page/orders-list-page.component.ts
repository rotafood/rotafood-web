import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetailOrderDialogComponent } from '../../components/detail-order-dialog/detail-order-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { PaginationDto } from '../../../../core/interfaces/pagination';
import { PageEvent } from '@angular/material/paginator';
import { OrderDto } from '../../../../core/interfaces/order';
import { OrderService } from '../../../../core/services/orders.service';
import { Subscription, interval } from 'rxjs';
import { DialogErrorContentComponent } from '../../../../shared/dialog-error-content/dialog-error-content.component';
import { OrderStatus, orderStatusMap } from '../../../../core/enums/order-status';

@Component({
  selector: 'app-orders-list-page',
  templateUrl: './orders-list-page.component.html',
  styleUrls: ['./orders-list-page.component.scss'],
})
export class OrdersListPageComponent implements OnInit, OnDestroy {
  isLoading = false;
  activeTabIndex = 0;
  refreshSubscription!: Subscription;

  OrderStatusMap = orderStatusMap

  dateRangeForm = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });

  orderTypeOptions = [
    { key: OrderStatus.ALL, label: 'Todos' },
    { key: OrderStatus.COMPLETED, label: 'Concluídos' },
    { 
      key: 'OPEN_ORDERS', 
      label: 'Em Aberto' 
    },
    { key: OrderStatus.CANCELED, label: 'Cancelados' }
  ];
  

  orders: PaginationDto<OrderDto> = {
    currentPage: 0,
    totalPages: 0,
    pageSize: 10,
    totalCount: 0,
    hasPrevious: false,
    hasNext: false,
    data: []
  };

  displayedColumns: string[] = ['createdAt', 'salesChannel', 'id', 'status', 'total'];

  constructor(
    public dialog: MatDialog,
    private ordersService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();

    this.refreshSubscription = interval(30000)
      .pipe()
      .subscribe(() => {
        this.loadOrders()
      });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  getOrderStatus(status: string): string {
    return this.OrderStatusMap[status as OrderStatus] || status;
  }
  
  

  loadOrders(): void {
    this.isLoading = true;
    this.ordersService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        this.dialog.open(DialogErrorContentComponent, {
          data: { message: error.error || 'Erro ao carregar pedidos.' }
        });
        this.isLoading = false;
      }
    });
  }

  get filteredOrders() {
    const currentType = this.orderTypeOptions[this.activeTabIndex].key;
  
    if (currentType === OrderStatus.ALL) {
      return this.orders.data;
    } else if (currentType === 'OPEN_ORDERS') {
      return this.orders.data.filter(order => 
        [OrderStatus.CREATED, OrderStatus.CONFIRMED, OrderStatus.PREPARATION_STARTED, OrderStatus.READY_TO_PICKUP, OrderStatus.DISPATCHED]
        .includes(order.status as OrderStatus)
      );
    } else {
      return this.orders.data.filter(order => order.status === currentType);
    }
  }
  

  handlePageEvent(event: PageEvent) {
    this.orders.currentPage = event.pageIndex;
    this.orders.pageSize = event.pageSize;
  }

  openOrderModal(order: OrderDto) {
    this.dialog.open(DetailOrderDialogComponent, {
      width: '60vw',
      data: { order }
    });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(date));
  }
  
}
