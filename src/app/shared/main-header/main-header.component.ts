import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu'
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from "@angular/common";
import { ScrollService } from '../../core/services/scroll/scroll.service';
import { loginRegisterMook, mainRoutesMook } from '../../core/mooks/rotafood-main-routes';



@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [
    
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    CommonModule

  ],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss'
})
export class MainHeaderComponent {

  public mainRoutesMook = mainRoutesMook

  public loginRegisterMook = loginRegisterMook

  constructor(private scrollService: ScrollService) {}

  scrollToId(id: string) {
    console.log("element id : ", id);
    this.scrollService.scrollToElementById(id);
  }
}
