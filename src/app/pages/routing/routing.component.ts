import { Component } from '@angular/core';
import { MainHeaderComponent } from '../../shared/main-header/main-header.component';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { RoutingFormsComponent } from './routing-forms/routing-forms.component';
import { HttpClientModule } from '@angular/common/http';
import { Cvrp } from '../../core/interfaces/cvrp';
import { CommonModule } from '@angular/common';
import { MapVrpComponent } from '../../shared/map-vrp/map-vrp.component';

@Component({
  selector: 'app-routing',
  standalone: true,
  imports: [
    MainHeaderComponent,
    RoutingFormsComponent,
    HttpClientModule,
    CommonModule,
    MapVrpComponent
    
  ],
  templateUrl: './routing.component.html',
  styleUrl: './routing.component.scss'
})
export class RoutingComponent {
  public cvrp: Cvrp | null = null;
  handleCvrpData(cvrpData: Cvrp) {
    this.cvrp = null
    console.log("Dados CVRP recebidos:", cvrpData);
    if (cvrpData != null) {
      this.cvrp = cvrpData
    }
  }
}
