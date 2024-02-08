import { Component, ViewChild } from '@angular/core';
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
      RegisterUserFormComponent
    
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  @ViewChild(RegisterMerchantFormComponent) merchantForm!: RegisterMerchantFormComponent
  @ViewChild(RegisterUserFormComponent) userForm!: RegisterUserFormComponent
  
  public loading = false;
  public merchantData!:Merchant
  public userData!:User

  onMerchantFormSubmit(merchantFormData: Merchant) {
    this.merchantData = merchantFormData
  }

  onUserFormSubmit(userFormData: User) {
    this.userData = userFormData
  }
  onSubmit() {
    console.log('User', this.userData)
    console.log('Merchant', this.merchantData)
  }


}
