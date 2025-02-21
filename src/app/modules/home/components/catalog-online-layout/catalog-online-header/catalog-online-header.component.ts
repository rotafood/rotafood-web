import { Component, Input } from '@angular/core';
import { WindowWidthService } from '../../../../../core/services/window-width/window-width.service';
import { ShowCatalogOnlineSideNavService } from '../../../../../core/services/show-catalog-online-side-nav.service';
import { MerchantDto } from '../../../../../core/interfaces/merchant';

@Component({
  selector: 'app-catalog-online-header',
  templateUrl: './catalog-online-header.component.html',
  styleUrl: './catalog-online-header.component.scss'
})
export class CatalogOnlineHeaderComponent {

  @Input()
  merchant: MerchantDto | undefined = undefined

  constructor(
    public sideNavService: ShowCatalogOnlineSideNavService,
    public windowWidth: WindowWidthService
    ) {}
  toggleSideNav() {
    this.sideNavService.toggleNav();
  }

  getHasOpened(): boolean {
    if (!this.merchant?.lastRotafoodOpenedUtc) {
      return false;
    }
  
    const lastOpenedUTC = new Date(this.merchant.lastRotafoodOpenedUtc).getTime();
  
    const nowUTC = Date.now();
  
    return (nowUTC - lastOpenedUTC) <= 30000;
  }
  
}
