import { Component } from '@angular/core';
import { MainHeaderComponent } from '../../shared/main-header/main-header.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { HomeBannerComponent } from './home-banner/home-banner.component';
import { HomeWhayRoutineComponent } from './home-whay-routine/home-whay-routine.component';
import { HomeServicesComponent } from './home-services/home-services.component';
import { HomePricingComponent } from './home-pricing/home-pricing.component';
import { HomeAboutUsComponent } from './home-about-us/home-about-us.component';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MainHeaderComponent,
    HomeBannerComponent,
    HomeWhayRoutineComponent,
    HomeServicesComponent,
    HomePricingComponent,
    HomeAboutUsComponent,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
