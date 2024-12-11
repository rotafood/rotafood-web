import { Component } from '@angular/core';
import { LogService } from '../../../../core/services/log/log.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private readonly logService: LogService) {}

  ngOnInit() {
    this.logService.postLog(new Date(), window.location.href)
  }

}
