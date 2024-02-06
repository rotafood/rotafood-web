import { Component } from '@angular/core';
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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
      MatIconModule,
      MatInputModule,
      MatProgressSpinnerModule,
      MatFormFieldModule,
      MatButtonModule,
      ReactiveFormsModule,
      RouterModule,
      DefaultFormContainerComponent,
      DefaultLayoutComponent,
      AddressAutocompleteGoogleMapsComponent,
      CommonModule,
      MatSelectModule,
      MatStepperModule
    
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  
  public loading = false;
  public addressErrorMessage: string | null = null;
  public errorMessage: string | null = null; 
  public merchantForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    documentType: new FormControl<'CPF' | 'CNPJ'>('CPF', Validators.required),
    document: new FormControl<string>('', Validators.required),
    address: new FormControl<Address | null>(null, [Validators.required])
  });
  public userForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    name: new FormControl<string>('', Validators.required),
    phone: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
  })


  onAddressSelected(address: Address) {
    this.merchantForm.controls['address'].setValue(address);
  }

  onSubmit() {
    
  }


}
