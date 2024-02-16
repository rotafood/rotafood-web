import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Address } from '../../../../core/interfaces/address';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AddressAutocompleteGoogleMapsComponent } from '../../../../shared/address-autocomplete-google-maps/address-autocomplete-google-maps.component';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RegisterMerchantFormService } from '../../../../core/services/register-forms/register-merchant-form/register-merchant-form.service';

@Component({
  selector: 'app-register-merchant-form',
  standalone: true,
  imports: [
      MatInputModule,
      MatFormFieldModule,
      MatButtonModule,
      ReactiveFormsModule,
      AddressAutocompleteGoogleMapsComponent,
      CommonModule,
      MatSelectModule,
  ],
  templateUrl: './register-merchant-form.component.html',
  styleUrl: './register-merchant-form.component.scss'
})
export class RegisterMerchantFormComponent {



    constructor(
      public merchantForm: RegisterMerchantFormService
    ) {}

    onSubmit(event: Event) {
      event.preventDefault();
      // Coloque aqui a lógica que deve acontecer quando o formulário for submetido
    }
  
  



}
