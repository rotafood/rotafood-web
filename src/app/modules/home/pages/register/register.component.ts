import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { DialogErrorContentComponent } from '../../../../shared/dialog-error-content/dialog-error-content.component';
import { MerchantCreateDto } from '../../../../core/interfaces/merchant-create';
import { OwnerCreateDto } from '../../../../core/interfaces/owner-create';
import { MerchantOwnerCreationDto } from '../../../../core/interfaces/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MerchantType } from '../../../../core/enums/merchant-type';
import { Address } from '../../../../core/interfaces/address';
import { merchantTypesMock } from '../../../../core/mocks/merchant-type';
import { DocumentType } from '../../../../core/enums/document-type';


@Component({
  selector: 'app-register',
  providers: [
    AuthService
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent  {


  public merchantTypesMock = merchantTypesMock;
  public isLoading = false;
  public merchantForm = new FormGroup({
      name: new FormControl<string>('', Validators.required),
      phone: new FormControl<string>('', Validators.required),
      merchantType: new FormControl<MerchantType>(MerchantType.RESTAURANT, [Validators.required]),
      description: new FormControl<string>('', Validators.required),
      documentType: new FormControl<DocumentType>(DocumentType.CPF, Validators.required),
      document: new FormControl<string>('', Validators.required),
      address: new FormControl<Address | null>(null, Validators.required)
    })
  
  public userForm = new FormGroup({
      name: new FormControl<string>('', Validators.required),
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      phone: new FormControl<string>('', Validators.required),
      password: new FormControl<string>('', Validators.required),
    })
  



  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly dialog: MatDialog
    ) {}


  formatPhone(value: string): void {
    if (!value) return;
  
    const cleaned = value.replace(/\D/g, '');
  
    let formattedValue = cleaned;
  
    if (cleaned.length > 2) {
      formattedValue = `(${cleaned.slice(0, 2)}) `;
  
      if (cleaned.length > 7) {
        formattedValue += `${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
      } else if (cleaned.length > 2) {
        formattedValue += cleaned.slice(2);
      }
    }
  
    if (this.userForm.controls.phone.value !== formattedValue) {
      this.userForm.controls.phone.setValue(formattedValue, { emitEvent: false });
    }
  }


  addressFound(address: Address) {
    this.merchantForm.controls.address.setValue(address);
  }

  showErros() {
    console.log(this.merchantForm.errors)
    console.log(this.merchantForm.valid)
    console.log(this.merchantForm.value)

  }

  

  onSubmit() {
      if (this.userForm && this.merchantForm) {
          const MerchantOwnerCreationDto: MerchantOwnerCreationDto = {
            merchant: this.merchantForm.value as MerchantCreateDto,
            owner: this.userForm.value as OwnerCreateDto
          }
          this.isLoading = true;
          this.authService.createMerchant(MerchantOwnerCreationDto).subscribe({
            next: (response) => {
              const tokenResponse = response;
              this.isLoading = false;
              this.router.navigate(['/admin']);
            },
            error: (error) => {
              console.error('Error:', error);
              this.dialog.open(DialogErrorContentComponent, {data: {
                message: error.error || "Erro ao criar a conta!"
              }})
              this.isLoading = false;
            }
          });
      }
  }
}
