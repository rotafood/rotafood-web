import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu'
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from "@angular/common";
import { ScrollService } from '../../../core/services/scroll-to/scroll.service';
import { defaultRoutesMook, loginRegisterMook } from '../../../core/mooks/default-routes';



@Component({
  selector: 'app-default-header',
  standalone: true,
  imports: [
    
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    CommonModule

  ],
  templateUrl: './default-header.component.html',
  styleUrl: './default-header.component.scss'
})
export class DefaultHeaderComponent {

  public defaultRoutesMook = defaultRoutesMook

  public loginRegisterMook = loginRegisterMook

  constructor(private scrollService: ScrollService) {}

  scrollToId(id: string) {
    console.log("element id : ", id);
    this.scrollService.scrollToElementById(id);
  }
}
