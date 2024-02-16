import { Injectable } from '@angular/core';
import { Merchant } from '../../../interfaces/merchant';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { mookAddress } from '../../../mooks/address';
import { Address } from '../../../interfaces/address';

@Injectable({
  providedIn: 'root'
})
export class RegisterMerchantFormService {

  private merchantForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    documentType: new FormControl<'CPF' | 'CNPJ'>('CPF', Validators.required),
    document: new FormControl<string>('', Validators.required),
    address: new FormControl<Address | null>(mookAddress, Validators.required)
  });

  isCompleted(): boolean {
    return this.merchantForm.valid;
  }

  getData(): Merchant {
      return this.merchantForm.value as Merchant;
  }

  get formGroup() {
    return this.merchantForm;
  }
}
