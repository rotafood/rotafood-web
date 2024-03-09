import { Component } from '@angular/core';
import { Cvrp } from '../../../../core/interfaces/cvrp';

@Component({
  selector: 'app-vrp-test',
  templateUrl: './vrp-test.component.html',
  styleUrl: './vrp-test.component.scss'
})
export class VrpTestComponent {
  public cvrp: Cvrp | null = null;
  handleCvrpData(cvrpData: Cvrp) {
    this.cvrp = null
    if (cvrpData != null) {
      this.cvrp = cvrpData
    }
  }
}