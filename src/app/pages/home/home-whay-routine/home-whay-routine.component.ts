import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import { Observable, Subscription, fromEvent, map, startWith } from 'rxjs';
import { WindowWidthService } from '../../../core/services/window-width/window-width.service';
import { whayRoutineBeneficts } from '../../../core/mooks/whay-routine-benedicts';

@Component({
  selector: 'app-home-whay-routine',
  standalone: true,
  imports: [
    MatGridListModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './home-whay-routine.component.html',
  styleUrl: './home-whay-routine.component.scss'
})
export class HomeWhayRoutineComponent {

  public beneficts = whayRoutineBeneficts

  private widthSub!: Subscription;
  public cols!: number;

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
