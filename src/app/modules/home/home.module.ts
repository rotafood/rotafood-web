import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { DefaultLayoutComponent } from '../../shared/default-layout/default-layout.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { HomeBannerComponent } from './pages/home/home-banner/home-banner.component';
import { HomeServicesComponent } from './pages/home/home-services/home-services.component';
import { HomePricingComponent } from './pages/home/home-pricing/home-pricing.component';
import { HomeAboutUsComponent } from './pages/home/home-about-us/home-about-us.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { DefaultFormContainerComponent } from '../../shared/default-form-container/default-form-container.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SpinnerButtonComponent } from '../../shared/spinner-button/spinner-button.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AddressAutocompleteGoogleMapsComponent } from '../../shared/address-autocomplete-google-maps/address-autocomplete-google-maps.component';
import { MatSelectModule } from '@angular/material/select';
import { HomeRoutineComponent } from './pages/home/home-routine/home-routine.component';
import { HomeWhayUseComponent } from './pages/home/home-whay-use/home-whay-use.component';
import { CatalogsOnlineComponent } from './pages/catalogs-online/catalogs-online.component';
import { CatalogOnlineContextComponent } from './pages/catalog-online-context/catalog-online-context.component';
import { HomeGoFurtherComponent } from './pages/home/home-go-further/home-go-further.component';
import { CatalogOnlineHeaderComponent } from './components/catalog-online-layout/catalog-online-header/catalog-online-header.component';
import { CatalogOnlineLayoutComponent } from './components/catalog-online-layout/catalog-online-layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FooterComponent } from '../../shared/footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddOrderItemDialogComponent } from './components/add-order-item-dialog/add-order-item-dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { ReviewOrderPageComponent } from './pages/review-order-page/review-order-page.component';
import { OrderStatusPageComponent } from './pages/order-status-page/order-status-page.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CepAutocompleteComponent } from "../../shared/cep-autocomplete/cep-autocomplete.component";
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { StripeModule } from "stripe-angular";
import { MatButtonToggleModule } from '@angular/material/button-toggle';



@NgModule({
  declarations: [
    HomeComponent,
    HomeBannerComponent,
    HomeRoutineComponent,
    HomeWhayUseComponent,
    HomeServicesComponent,
    HomeGoFurtherComponent,
    HomePricingComponent,
    HomeAboutUsComponent,
    CatalogOnlineHeaderComponent,
    CatalogOnlineLayoutComponent,
    CatalogsOnlineComponent,
    CatalogOnlineContextComponent,
    ReviewOrderPageComponent,
    AddOrderItemDialogComponent,
    LoginComponent,
    RegisterComponent,
    OrderStatusPageComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    DefaultLayoutComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatRadioModule,
    MatCardModule,
    MatButtonToggleModule,
    NgxMapLibreGLModule,
    MatGridListModule,
    MatSelectModule,
    MatToolbarModule,
    MatSidenavModule,
    RouterModule,
    FooterComponent,
    MatInputModule,
    ReactiveFormsModule,
    DefaultFormContainerComponent,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    SpinnerButtonComponent,
    MatStepperModule,
    MatDialogModule,
    HttpClientModule,
    SpinnerButtonComponent,
    AddressAutocompleteGoogleMapsComponent,
    CepAutocompleteComponent,
    StripeModule.forRoot("pk_test_51R7kQcPjntxygQ1oi5dcBAUvSQGKuiS8rD6UrIyBHDxErPP2r7RXJDmcjiypH4yrBKgYMMN9uRZ03hr38AMTx0rK00zIYwt6Gq"),
]
})
export class HomeModule { }
