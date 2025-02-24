import { Component, Input } from '@angular/core';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { ShowCatalogOnlineSideNavService } from '../../../../core/services/show-catalog-online-side-nav.service';
import { CatalogOnlineOrderService } from '../../../../core/services/catalog-online-order.service';
import { SharedOrderService } from '../../../../core/services/shared-order.service';
import { FullOrderDto } from '../../../../core/interfaces/full-order';
import { MerchantDto } from '../../../../core/interfaces/merchant';
import { OrderItemDto } from '../../../../core/interfaces/order-item';

@Component({
  selector: 'app-catalog-online-layout',
  templateUrl: './catalog-online-layout.component.html',
  styleUrls: ['./catalog-online-layout.component.scss']
})
export class CatalogOnlineLayoutComponent {
  @Input() merchant: MerchantDto | undefined = undefined;
  order: FullOrderDto | null = null;
  orderItems: OrderItemDto[] = [];
  totalPrice = 0;
  public showNav = false;
  public isMobile = false;

  constructor(
    public windowService: WindowWidthService,
    public sideNavService: ShowCatalogOnlineSideNavService,
    private catalogOnlineOrderService: CatalogOnlineOrderService,
    private sharedOrderService: SharedOrderService
  ) {
    this.sideNavService.currentShowNav.subscribe(showNav => this.showNav = showNav);
    this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);
    this.catalogOnlineOrderService.order$.subscribe(order => this.order = order);
    this.sharedOrderService.items$.subscribe(items => {
      console.log(items)
      this.orderItems = items;
      this.calculateTotal();
    });
  }

  toggleSideNav() {
    this.sideNavService.toggleNav();
  }

  removeItem(index: number) {
    this.sharedOrderService.removeItemByIndex(index);
  }

  increaseQuantity(index: number) {
    this.sharedOrderService.increaseQuantityByIndex(index);
  }

  decreaseQuantity(index: number) {
    this.sharedOrderService.decreaseQuantityByIndex(index);
  }

  private calculateTotal() {
    this.totalPrice = this.orderItems.reduce((total, item) => total + item.totalPrice, 0);
  }
}
