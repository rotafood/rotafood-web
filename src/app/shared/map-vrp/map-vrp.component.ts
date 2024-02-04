import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Cvrp } from '../../core/interfaces/cvrp';
import { CommonModule } from '@angular/common';
import { FeatureComponent, GeoJSONSourceComponent, LayerComponent, MapComponent, MarkerComponent } from '@maplibre/ngx-maplibre-gl';
import { BehaviorSubject } from 'rxjs';
import { MapVrpRouteComponent } from './map-vrp-route/map-vrp-route.component';
import { MapVrpOrderComponent } from './map-vrp-order/map-vrp-order.component';
import createColormap from 'colormap';
import { MapVrpMerchantComponent } from './map-vrp-merchant/map-vrp-merchant.component';

@Component({
  selector: 'app-map-vrp',
  standalone: true,
  imports: [
    CommonModule, 
    MapComponent, 
    MapVrpRouteComponent, 
    MapVrpOrderComponent,
    LayerComponent,
    MarkerComponent,
    GeoJSONSourceComponent,
    FeatureComponent,
    MapVrpMerchantComponent
  ],
  templateUrl: './map-vrp.component.html',
  styleUrls: ['./map-vrp.component.scss']
})
export class MapVrpComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  
  public center: [number, number] = [-46.402459, -21.571489];
  public showMap: boolean = false;
  private cvrpChanges = new BehaviorSubject<Cvrp | null>(null);
  public colormap: string[] = [];

  public _cvrp: Cvrp | null = null;
  @Input() set cvrp(value: Cvrp) {
    this._cvrp = value;
    this.cvrpChanges.next(value);
    this.updateMap(value);
  }

  ngOnInit(): void {
    this.cvrpChanges.subscribe((cvrpValue) => {
      this.updateMap(cvrpValue);
    });
  }

  private updateMap(cvrpValue: Cvrp | null): void {
    if (cvrpValue && cvrpValue.merchant && cvrpValue.routes) {
      console.log("Atualização do CVRP no MapVrpComponent:", cvrpValue);
      this.showMap = false;
      setTimeout(() => {
        this.center = [
          cvrpValue.merchant.address.longitude,
          cvrpValue.merchant.address.latitude
        ];
        this.colormap = createColormap<"hex">({
          alpha: 1,
          colormap: "rainbow",
          nshades: cvrpValue.routes.length > 9 ? cvrpValue.routes.length : 9,
          format: "hex",
        });
        this.showMap = true;
      }, 100); // Ajuste este delay conforme necessário
    }
  }
}

