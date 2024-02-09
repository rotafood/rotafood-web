import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Address } from '../../../../core/interfaces/address';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AddressAutocompleteGoogleMapsComponent } from '../../../../shared/address-autocomplete-google-maps/address-autocomplete-google-maps.component';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, Observable, map, startWith } from 'rxjs';
import { mookAddress } from '../../../../core/mooks/address';
import { Merchant } from '../../../../core/interfaces/merchant';

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



  public errorMessage: string|null = null;

  
  public merchantForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    documentType: new FormControl<'CPF' | 'CNPJ'>('CPF', Validators.required),
    document: new FormControl<string>('', Validators.required),
    address: new FormControl<Address | null>(mookAddress, Validators.required)
  });

  isFormCompleted(): boolean {
    return this.merchantForm.valid;
}

  // Método para obter os dados do formulário
  onSubmit(): Merchant {
      return this.merchantForm.value as Merchant;
  }



}
