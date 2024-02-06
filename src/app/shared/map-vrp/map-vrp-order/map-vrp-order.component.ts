import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CvrpOrder, CvrpRoute } from '../../../core/interfaces/cvrp';
import { MarkerComponent, PopupComponent } from '@maplibre/ngx-maplibre-gl';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

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