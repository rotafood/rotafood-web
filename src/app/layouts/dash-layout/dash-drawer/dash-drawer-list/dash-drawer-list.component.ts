import { Component, Input } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatNavList } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { DashRoute } from '../../../../core/interfaces/dash-route';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-dash-drawer-list',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatNavList,
    MatIconModule,
    RouterModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './dash-drawer-list.component.html',
  styleUrl: './dash-drawer-list.component.scss'
})
export class DashDrawerListComponent {
  @Input() dashRoute!: DashRoute

}
