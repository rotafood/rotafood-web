import { Component, Input, OnInit } from '@angular/core';
import { MarkerComponent } from '@maplibre/ngx-maplibre-gl';
import { CvrpOrder } from '../../../../core/interfaces/cvrp';

@Component({
  selector: 'app-map-vrp-order',
  templateUrl: './map-vrp-order.component.html',
  styleUrl: './map-vrp-order.component.scss'
})
export class MapVrpOrderComponent implements OnInit {
  public point: [number, number] = [-47.402459, -22.571489];
  
  @Input() public order!: CvrpOrder;
marker: MarkerComponent|undefined;
  
  ngOnInit(): void {
    this.point = [this.order.address.longitude, this.order.address.latitude]
    console.log(this.point)
  }


}