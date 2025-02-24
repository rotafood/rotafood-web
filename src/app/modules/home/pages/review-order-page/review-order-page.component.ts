import { Component } from '@angular/core';
import { FullOrderDto } from '../../../../core/interfaces/full-order';
import { OrderItemDto } from '../../../../core/interfaces/order-item';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { ShowCatalogOnlineSideNavService } from '../../../../core/services/show-catalog-online-side-nav.service';
import { CatalogOnlineOrderService } from '../../../../core/services/catalog-online-order.service';
import { SharedOrderService } from '../../../../core/services/shared-order.service';

@Component({
  selector: 'app-review-order-page',
  templateUrl: './review-order-page.component.html',
  styleUrl: './review-order-page.component.scss'
})
export class ReviewOrderPageComponent {

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
