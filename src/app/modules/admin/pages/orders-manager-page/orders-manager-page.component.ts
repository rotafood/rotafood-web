import { Component } from '@angular/core';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { ShowAdminSideNavService } from '../../../../core/services/show-admin-side-nav/show-admin-side-nav.service';

@Component({
  selector: 'app-orders-manager-page',
  templateUrl: './orders-manager-page.component.html',
  styleUrl: './orders-manager-page.component.scss'
})
export class OrdersManagerPageComponent {
  public showNav = false;
  public isMobile = false;

  constructor(
    public windowService: WindowWidthService,
    public sideNavService: ShowAdminSideNavService,
    ) {
      this.sideNavService.currentShowNav.subscribe(showNav => this.showNav = showNav);
      this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);
      
    }
  }