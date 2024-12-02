import { Component } from '@angular/core';
import { Vrp } from '../../../../core/interfaces/vrp';
import { LogService } from '../../../../core/services/log/log.service';

@Component({
  selector: 'app-vrp-test',
  templateUrl: './vrp-test.component.html',
  styleUrl: './vrp-test.component.scss'
})
export class VrpTestComponent {
  
  public vrp: Vrp | null = null;

  constructor(private logService: LogService) {}
  ngOnInit() {
    this.logService.postLog(new Date(), window.location.href)
  }

  handleVrpData(vrpData: Vrp) {
    this.vrp = null
    if (vrpData != null) {
      this.vrp = vrpData
    }
  }
}