import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { WindowWidthService } from '../../../core/services/window-width/window-width.service';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import { rotafoodServices } from '../../../core/mocks/rotafood-services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-services',
  standalone: true,
  imports: [
    MatGridListModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './home-services.component.html',
  styleUrl: './home-services.component.scss'
})
export class HomeServicesComponent {
  private widthSub!: Subscription;
  public cols!: number;
  public rotafoodServices = rotafoodServices

  constructor(private windowWidthService: WindowWidthService) {}

  ngOnInit() {
    this.widthSub = this.windowWidthService.getWindowWidth().subscribe(width => {
      this.cols = width > 600 ? 2 : 1;
    });
  }

  

  ngOnDestroy() {
    if (this.widthSub) {
      this.widthSub.unsubscribe();
    }
  }

  onResize() {
    this.widthSub = this.windowWidthService.getWindowWidth().subscribe(width => {
      this.cols = width > 600 ? 2 : 1;
    });
  }

}
