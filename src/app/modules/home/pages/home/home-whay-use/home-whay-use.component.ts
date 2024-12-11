import { Component } from '@angular/core';
import { whayRoutineBeneficts } from '../../../../../core/mocks/whay-routine-benedicts';

@Component({
  selector: 'app-home-whay-use',
  templateUrl: './home-whay-use.component.html',
  styleUrl: './home-whay-use.component.scss'
})
export class HomeWhayUseComponent {
  public whayRoutineBeneficts = whayRoutineBeneficts;
}
