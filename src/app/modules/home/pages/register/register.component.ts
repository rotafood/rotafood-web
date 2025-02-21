import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { DialogErrorContentComponent } from '../../../../shared/dialog-error-content/dialog-error-content.component';
import { MerchantCreateDto } from '../../../../core/interfaces/merchant-create';
import { OwnerCreateDto } from '../../../../core/interfaces/owner-create';
import { MerchantOwnerCreationDto } from '../../../../core/interfaces/auth';
import { LogService } from '../../../../core/services/log/log.service';

@Component({
  selector: 'app-register',
  providers: [
    AuthService
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent  {


  
  public isLoading = false;
  public merchantForm: MerchantCreateDto | undefined;
  public ownerForm: OwnerCreateDto | undefined;



  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly dialog: MatDialog
    ) {}

  handleFormSubmitMerchantForm(merchantForm: MerchantCreateDto | undefined) {
    this.merchantForm = merchantForm
  }

  handleFormSubmitOwnerForm(ownerForm: OwnerCreateDto | undefined) {
    this.ownerForm = ownerForm
  }

  ngOnInit() {
  }

  

  onSubmit() {
      if (this.ownerForm && this.merchantForm) {
          const MerchantOwnerCreationDto: MerchantOwnerCreationDto = {
            merchant: this.merchantForm,
            owner: this.ownerForm
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
