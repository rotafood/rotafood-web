import { Component } from '@angular/core';
import { WindowWidthService } from '../../../core/services/window-width/window-width.service';
import { ShowDashSideNavService } from '../../../core/services/show-dash-side-nav/show-dash-side-nav.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { DashDrawerListComponent } from './dash-drawer-list/dash-drawer-list.component';
import { CommonModule } from '@angular/common';
import { DashRoute } from '../../../core/interfaces/dash-route';
import { MyRoutesService } from '../../../core/services/my-routes/my-routes.service';

@Component({
  selector: 'app-dash-drawer',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatNavList,
    DashDrawerListComponent,
    CommonModule
  ],
  templateUrl: './dash-drawer.component.html',
  styleUrl: './dash-drawer.component.scss'
})
export class DashDrawerComponent {
  public showNav = false;
  public isMobile = false;
  public dashRoutes: DashRoute[] = []

  constructor(
    public windowService: WindowWidthService,
    public sideNavService: ShowDashSideNavService,
    private myRoutesService: MyRoutesService
    ) {
      this.sideNavService.currentShowNav.subscribe(showNav => this.showNav = showNav);
      this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);
      
      this.myRoutesService.dashRoutes$.subscribe(routes => {
        this.dashRoutes = routes;
      });
    }
}