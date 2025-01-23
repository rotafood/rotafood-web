import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OrderStatus } from '../../../../core/enums/order-status';
import { DetailOrderDialogComponent } from '../../components/detail-order-dialog/detail-order-dialog.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-orders-list-page',
  templateUrl: './orders-list-page.component.html',
  styleUrls: ['./orders-list-page.component.scss'],

})
export class OrdersListPageComponent {
  isLoading = false;
  activeTabIndex = 0;

  dateRangeForm = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });

  // Define os tipos de pedidos com o enum OrderStatus
  orderTypeOptions = [
    { key: OrderStatus.ALL, label: 'Todos' },
    { key: OrderStatus.COMPLETED, label: 'Concluídos' },
    { key: OrderStatus.CONFIRMED, label: 'Em Aberto' },
    { key: OrderStatus.CANCELED, label: 'Cancelados' }
  ];

  // Dados mockados para pedidos
  orders = new MatTableDataSource([
    { id: '001', time: '10:00', channel: 'App', status: OrderStatus.COMPLETED, total: 150, netTotal: 140 },
    { id: '002', time: '11:30', channel: 'Site', status: OrderStatus.CONFIRMED, total: 200, netTotal: 190 },
    { id: '003', time: '12:45', channel: 'App', status: OrderStatus.CANCELED, total: 100, netTotal: 0 },
  ]);

  displayedColumns: string[] = ['time', 'channel', 'id', 'status', 'total', 'netTotal'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.orders.paginator = this.paginator;
  }

  get filteredOrders() {
    const currentType = this.orderTypeOptions[this.activeTabIndex].key;
    if (currentType === OrderStatus.ALL) return this.orders.data;

    return this.orders.data.filter(order => order.status === currentType);
  }

  openOrderModal(order: any) {
    this.dialog.open(DetailOrderDialogComponent, {
      width: '60vw',
      data: { order }
    });
  }
}
