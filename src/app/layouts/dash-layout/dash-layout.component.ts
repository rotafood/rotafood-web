import { Component } from '@angular/core';
import { DashHeaderComponent } from './dash-header/dash-header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { WindowWidthService } from '../../core/services/window-width/window-width.service';
import { ShowDashSideNavService } from '../../core/services/show-dash-side-nav/show-dash-side-nav.service';
import { DashDrawerComponent } from './dash-drawer/dash-drawer.component';

@Component({
  selector: 'app-dash-layout',
  standalone: true,
  imports: [
    DashHeaderComponent,
    MatSidenavModule,
    MatNavList,
    DashDrawerComponent
  ],
  templateUrl: './dash-layout.component.html',
  styleUrl: './dash-layout.component.scss'
})
export class DashLayoutComponent {

  public showNav = false;
  public isMobile = false;

  constructor(
    public windowService: WindowWidthService,
    public sideNavService: ShowDashSideNavService
    ) {
    this.sideNavService.currentShowNav.subscribe(showNav => this.showNav = showNav);
    this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);

  }
}
