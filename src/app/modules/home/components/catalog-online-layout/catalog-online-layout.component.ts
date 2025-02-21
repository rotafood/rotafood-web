import { Component, Input } from '@angular/core';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { ShowCatalogOnlineSideNavService } from '../../../../core/services/show-catalog-online-side-nav.service';
import { CatalogOnlineService } from '../../../../core/services/catalog-online.service';
import { ItemDto } from '../../../../core/interfaces/item';
import { CatalogOnlineOrderService } from '../../../../core/services/catalog-online-order.service';
import { FullOrderDto } from '../../../../core/interfaces/full-order';
import { MerchantDto } from '../../../../core/interfaces/merchant';

@Component({
  selector: 'app-catalog-online-layout',
  templateUrl: './catalog-online-layout.component.html',
  styleUrl: './catalog-online-layout.component.scss'
})
export class CatalogOnlineLayoutComponent {
  @Input()
  merchant: MerchantDto | undefined = undefined
  order: FullOrderDto | null = null;
  public showNav = false;
  public isMobile = false;

  constructor(
    public windowService: WindowWidthService,
    public sideNavService: ShowCatalogOnlineSideNavService,
    private catalogOnlineOrderService: CatalogOnlineOrderService
  ) {
    this.sideNavService.currentShowNav.subscribe(showNav => this.showNav = showNav);
    this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);
    this.catalogOnlineOrderService.order$.subscribe(order => this.order = order);
  }

  toggleSideNav() {
    this.sideNavService.toggleNav()
  }
}
