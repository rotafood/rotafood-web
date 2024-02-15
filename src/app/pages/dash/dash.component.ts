import { Component } from '@angular/core';
import { DashLayoutComponent } from '../../layouts/dash-layout/dash-layout.component';
import { MatIconModule } from '@angular/material/icon';
import { MyRoutesService } from '../../core/services/my-routes/my-routes.service';
import { DashRoute } from '../../core/interfaces/dash-route';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [
    DashLayoutComponent,
    MatIconModule,
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss'
})
export class DashComponent {

  public dashRoutes: DashRoute[] = []

  constructor(
    private myRoutesService: MyRoutesService,
  ) {
    this.myRoutesService.dashRoutes$.subscribe(routes => {
      this.dashRoutes = routes;
    });
  }

}
