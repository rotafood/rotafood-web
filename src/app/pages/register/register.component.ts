import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { DefaultFormContainerComponent } from '../../shared/default-form-container/default-form-container.component';
import { DefaultLayoutComponent } from '../../layouts/default-layout/default-layout.component';
import { Address } from '../../core/interfaces/address';
import { MatStepperModule } from '@angular/material/stepper';
import { AddressAutocompleteGoogleMapsComponent } from '../../shared/address-autocomplete-google-maps/address-autocomplete-google-maps.component';
import { CommonModule } from '@angular/common';
import { RegisterMerchantFormComponent } from './forms/register-merchant-form/register-merchant-form.component';
import { RegisterUserFormComponent } from './forms/register-user-form/register-user-form.component';
import { Merchant, User } from '../../core/interfaces/merchant';
import { AuthService } from '../../core/services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
      MatIconModule,
      MatInputModule,
      MatProgressSpinnerModule,
      MatButtonModule,
      RouterModule,
      DefaultFormContainerComponent,
      DefaultLayoutComponent,
      CommonModule,
      MatStepperModule,
      RegisterMerchantFormComponent,
      RegisterUserFormComponent,
      HttpClientModule
    
  ],
  providers: [
    AuthService
  ],

  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent  {

  @ViewChild(RegisterMerchantFormComponent) merchantFormComponent!: RegisterMerchantFormComponent
  @ViewChild(RegisterUserFormComponent) userFormComponent!: RegisterUserFormComponent
  
  public loading = false;
  public chieldLoading = false;
  public merchantData!: Merchant;
  public userData!: User;
  public errorMessage: string|null = null

  constructor(private authService: AuthService) {}

  onMerchantFormSubmit() {
      if (this.merchantFormComponent.isFormCompleted()) {
          this.merchantData = this.merchantFormComponent.onSubmit();
      }
  }

  onUserFormSubmit() {
      if (this.userFormComponent.isFormCompleted()) {
          this.userData = this.userFormComponent.onSubmit();

          this.authService.createMerchant(this.merchantData, this.userData).subscribe({
            next: (response) => {
              const tokenResponse = response;
              console.log(tokenResponse)
              this.loading = false;
            },
            error: (error) => {
              console.error('Error:', error);
              this.errorMessage = 'Ocorreu um erro interno de servidor :('; // Set error message
              this.loading = false;
            }
          });
      }

      
  }



  



}
