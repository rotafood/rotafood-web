import { Component } from '@angular/core';

import { RoutingFormsComponent } from './routing-forms/routing-forms.component';
import { HttpClientModule } from '@angular/common/http';
import { Cvrp } from '../../core/interfaces/cvrp';
import { CommonModule } from '@angular/common';
import { MapVrpModule } from '../../shared/map-vrp/map-vrp.module';
import { DefaultLayoutComponent } from '../../layouts/default-layout/default-layout.component';

@Component({
  selector: 'app-routing',
  standalone: true,
  imports: [
    RoutingFormsComponent,
    DefaultLayoutComponent,
    HttpClientModule,
    CommonModule,
    MapVrpModule
    
  ],
  templateUrl: './routing.component.html',
  styleUrl: './routing.component.scss'
})
export class RoutingComponent {
  public cvrp: Cvrp | null = null;
  handleCvrpData(cvrpData: Cvrp) {
    this.cvrp = null
    if (cvrpData != null) {
      this.cvrp = cvrpData
    }
  }
}
