import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { whayRoutineBeneficts } from '../../../../../core/mocks/whay-routine-benedicts';
import { WindowWidthService } from '../../../../../core/services/window-width/window-width.service';


@Component({
  selector: 'app-home-whay-routine',

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
