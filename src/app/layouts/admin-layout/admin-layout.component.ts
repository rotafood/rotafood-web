import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { WindowWidthService } from '../../core/services/window-width/window-width.service';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { ShowAdminSideNavService } from '../../core/services/show-admin-side-nav/show-admin-side-nav.service';
import { AdminDrawerComponent } from './admin-drawer/admin-drawer.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    AdminHeaderComponent,
    MatSidenavModule,
    MatNavList,
    AdminHeaderComponent,
    FooterComponent,
    AdminDrawerComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

  public showNav = false;
  public isMobile = false;

  constructor(
    public windowService: WindowWidthService,
    public sideNavService: ShowAdminSideNavService
    ) {
    this.sideNavService.currentShowNav.subscribe(showNav => this.showNav = showNav);
    this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);

  }
}
