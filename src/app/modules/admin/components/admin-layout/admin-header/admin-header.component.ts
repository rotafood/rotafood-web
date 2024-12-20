import { Component } from '@angular/core';
import { WindowWidthService } from '../../../../../core/services/window-width/window-width.service';
import { ShowAdminSideNavService } from '../../../../../core/services/show-admin-side-nav/show-admin-side-nav.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {

  constructor(
    public sideNavService: ShowAdminSideNavService,
    public windowWidth: WindowWidthService
    ) {}
  toggleSideNav() {
    this.sideNavService.toggleNav();
  }
  

}
