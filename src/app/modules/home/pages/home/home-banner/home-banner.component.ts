import { Component } from '@angular/core';
import { mockLoginDtoRegister } from '../../../../../core/mocks/default-routes';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.scss'
})
export class HomeBannerComponent {
  public mockLoginDtoRegister = mockLoginDtoRegister
}
