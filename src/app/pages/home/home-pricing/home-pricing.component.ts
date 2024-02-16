import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { rotafoodServices } from '../../../core/mocks/rotafood-services';
import { CommonModule } from '@angular/common';
import { treeMonthFree } from '../../../core/mocks/thee-month-free';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-pricing',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './home-pricing.component.html',
  styleUrl: './home-pricing.component.scss'
})
export class HomePricingComponent {
    public rotafoodServices = rotafoodServices
    public treeMonthFree = treeMonthFree
}
