import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject } from '@angular/core';
import { HomeAboutUsComponent } from './home-about-us/home-about-us.component';
import { HomeBannerComponent } from './home-banner/home-banner.component';
import { HomeGoFurtherComponent } from './home-go-further/home-go-further.component';
import { HomePricingComponent } from './home-pricing/home-pricing.component';
import { HomeRoutineComponent } from './home-routine/home-routine.component';
import { HomeWhayUseComponent } from './home-whay-use/home-whay-use.component';
import { DefaultLayoutComponent } from '../../shared/default-layout/default-layout.component';
import { MapVrpModule } from '../../modules/map-vrp/map-vrp.module';
import { Observable, tap } from 'rxjs';
import { RoutineTestService } from '../../core/services/routine-test/routine-test.service';
import { Vrp } from '../../core/interfaces/vrp/vrp';
import { MatButton, MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
    imports: [
    CommonModule,
    DefaultLayoutComponent,
    HomeAboutUsComponent,
    HomeBannerComponent,
    HomeGoFurtherComponent,
    HomePricingComponent,
    HomeRoutineComponent,
    HomeWhayUseComponent,
    MapVrpModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
]
})
export class HomeComponent {

private routineTestService = inject(RoutineTestService);
  
  public vrpTestResult: Vrp | null = null;
  private readonly TEST_POINTS = 30;
  private readonly TEST_LAT = -22.56531;
  private readonly TEST_LNG = -47.40155;

  public isLoading: boolean = false;
  ngOnInit(): void {
    this.loadVrpTest();
  }



  public loadVrpTest(): void {
    this.isLoading = true;
    this.vrpTestResult = null;
    this.routineTestService.generateAndSolveTestVrp(
      this.TEST_POINTS,
      this.TEST_LAT,
      this.TEST_LNG
    ).subscribe({
      next: (vrp: Vrp) => {
        console.log('VRP test recebido:', vrp);
        this.vrpTestResult = vrp;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao obter VRP test:', error);
        this.isLoading = false;
      }
    });
  }
}