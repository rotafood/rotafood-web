import { Component } from '@angular/core';
import { DashLayoutComponent } from '../../layouts/dash-layout/dash-layout.component';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [
    DashLayoutComponent
  ],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss'
})
export class DashComponent {

}
