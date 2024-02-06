import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CvrpRoute } from '../../../core/interfaces/cvrp';
import { FeatureComponent, GeoJSONSourceComponent, LayerComponent, MarkerComponent } from '@maplibre/ngx-maplibre-gl';
import { MapVrpOrderComponent } from '../map-vrp-order/map-vrp-order.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map-vrp-route',
  templateUrl: './map-vrp-route.component.html',
  styleUrl: './map-vrp-route.component.scss'
})
export class MapVrpRouteComponent implements OnInit {
  public geometry: GeoJSON.GeometryObject = {
    type: 'LineString',
    coordinates: [
      [-47.402459, -22.571489],
      [-47.402459, -21.571489],
      [-46.402459, -21.571489]
    ],
  };


  @Input() public route!: CvrpRoute;
  @Input() public color!: string;

  public paint: any;

  ngOnInit(): void {
    const points = this.route.points.map((point) => [point[0], point[1]])
    this.geometry = {
      type: 'LineString',
      coordinates: points,
    };
    this.paint = {
      'line-color': this.color,
      'line-width': 3,
      'line-opacity': 0.5
  }
  
  }

}
