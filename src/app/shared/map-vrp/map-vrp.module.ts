import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MapVrpComponent } from './map-vrp.component';
import { MapVrpRouteComponent } from './map-vrp-route/map-vrp-route.component';
import { MapVrpOrderComponent } from './map-vrp-order/map-vrp-order.component';
import { MapVrpMerchantComponent } from './map-vrp-merchant/map-vrp-merchant.component';

@NgModule({
  declarations: [
    MapVrpComponent,
    MapVrpRouteComponent, 
    MapVrpOrderComponent,
    MapVrpMerchantComponent,
  ],
  imports: [
    CommonModule, 
    NgxMapLibreGLModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  exports: [
    MapVrpComponent,
    MapVrpRouteComponent, 
    MapVrpOrderComponent,
    MapVrpMerchantComponent,
  ]
})
export class MapVrpModule { }
