import { Component } from '@angular/core';
import { rotafoodServices } from '../../../../../core/mocks/rotafood-services';

@Component({
  selector: 'app-home-go-further',
  templateUrl: './home-go-further.component.html',
  styleUrl: './home-go-further.component.scss'
})
export class HomeGoFurtherComponent {

  rotafoodServices = rotafoodServices

}
