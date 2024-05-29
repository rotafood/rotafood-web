import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Coordinate, Cvrp, CvrpRoute } from '../../../core/interfaces/cvrp';
import createColormap from 'colormap';
import { Merchant } from '../../../core/interfaces/merchant';


@Component({
  selector: 'app-map-vrp',
  templateUrl: './map-vrp.component.html',
  styleUrls: ['./map-vrp.component.scss']
})
export class MapVrpComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  public showNav = false;
  public showMap = false
  public center: Coordinate = { lat: -46.402459, lon: -21.571489 };
  public colormap: string[] = [];
  public merchant: Merchant | null = null;
  public selectedRoute: CvrpRoute | null = null;



  @Input() public vrp: Cvrp | null = null;

  toggleNav() {
    this.showNav = !this.showNav;
  }

  ngOnInit(): void {
    this.updateMap(this.vrp)
  }

  onRouteButtonClick(route: CvrpRoute) {
    this.selectedRoute = null;

    setTimeout(() => {
      this.selectedRoute = route;
      this.center = this.selectedRoute.routeLine[-1];
    }, 0);
  }

  private updateMap(vrp: Cvrp | null): void {
    this.showMap = false
    if (vrp) {
      setTimeout(() => {
        this.center = {
          lat: vrp.base.address.latitude,
          lon: vrp.base.address.longitude
        };
        this.colormap = createColormap<"hex">({
          alpha: 1,
          colormap: "rainbow",
          nshades: vrp.routes.length > 9 ? vrp.routes.length : 9,
          format: "hex",
        });

        this.showMap = true;
      }, 100);
    }
  }
}

