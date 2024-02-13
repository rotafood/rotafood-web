import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ShowDashSideNavService } from '../../../core/services/show-dash-side-nav/show-dash-side-nav.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { WindowWidthService } from '../../../core/services/window-width/window-width.service';
import { MatNavList } from '@angular/material/list';
import { DashUserMenuComponent } from '../dash-user-menu/dash-user-menu.component';

@Component({
  selector: 'app-dash-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    CommonModule,
    MatSidenavModule,
    MatNavList,
    DashUserMenuComponent
  ],
  templateUrl: './dash-header.component.html',
  styleUrl: './dash-header.component.scss'
})
export class DashHeaderComponent {

  constructor(
    public sideNavService: ShowDashSideNavService,
    public windowWidth: WindowWidthService
    ) {}
  toggleSideNav() {
    this.sideNavService.toggleNav();
  }
  

}
