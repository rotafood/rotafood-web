import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, input } from '@angular/core';
import { MarkerComponent, PopupComponent } from '@maplibre/ngx-maplibre-gl';
import { Merchant } from '../../../core/interfaces/merchant';

@Component({
  selector: 'app-map-vrp-merchant',
  standalone: true,
  imports: [
    CommonModule,
    MarkerComponent,
    PopupComponent
  ],
  templateUrl: './map-vrp-merchant.component.html',
  styleUrl: './map-vrp-merchant.component.scss'
})
export class MapVrpMerchantComponent implements OnInit  {
  
  public point:[number, number] = [-46.402459, -21.571489]
  
  @Input() public merchant!: Merchant; 
  
  ngOnInit(): void {
    this.point = [this.merchant.address.longitude, this.merchant.address.latitude]
    console.log(this.point)
  }
}
