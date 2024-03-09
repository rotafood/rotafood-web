import { Component, Input, OnInit } from '@angular/core';
import { Merchant } from '../../../../core/interfaces/merchant';

@Component({
  selector: 'app-map-vrp-merchant',
  templateUrl: './map-vrp-merchant.component.html',
  styleUrl: './map-vrp-merchant.component.scss'
})
export class MapVrpMerchantComponent implements OnInit  {
  
  public point:[number, number] = [-46.402459, -21.571489]
  
  @Input() public merchant!: Merchant; 
  
  ngOnInit(): void {
    this.point = [this.merchant.address.longitude, this.merchant.address.latitude]
  }
}
