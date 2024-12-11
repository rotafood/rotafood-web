import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../../../../../core/interfaces/address';
import { MerchantCreateDto } from '../../../../../../core/interfaces/merchant-create';
import { MerchantType } from '../../../../../../core/enums/merchant-type';
import { merchantTypesMock } from '../../../../../../core/mocks/merchant-type';
import { mockAddress } from '../../../../../../core/mocks/address';
import { DocumentType } from '../../../../../../core/enums/document-type';

@Component({
  selector: 'app-register-merchant-form',
  templateUrl: './register-merchant-form.component.html',
  styleUrl: './register-merchant-form.component.scss'
})
export class RegisterMerchantFormComponent {


  merchantTypesMock = merchantTypesMock;

  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    merchantType: new FormControl<MerchantType>(MerchantType.RESTAURANT, [Validators.required]),
    corporateName: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', Validators.required),
    documentType: new FormControl<DocumentType>(DocumentType.CPF, Validators.required),
    document: new FormControl<string>('', Validators.required),
    address: new FormControl<Address | null>(mockAddress, Validators.required)
  })

  @Output() formChange = new EventEmitter<MerchantCreateDto | undefined>();


  ngOnInit() {
    this.form.valueChanges.subscribe(value => {
      this.formChange.emit(this.form.valid ? value as MerchantCreateDto : undefined);
    });
  }

}
