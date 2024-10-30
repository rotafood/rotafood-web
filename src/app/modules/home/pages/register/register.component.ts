import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { DialogErrorContentComponent } from '../../../../shared/dialog-error-content/dialog-error-content.component';
import { MerchantCreate } from '../../../../core/interfaces/merchant-create';
import { OwnerCreate } from '../../../../core/interfaces/owner-create';
import { MerchantOwnerCreation } from '../../../../core/interfaces/auth';

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
  public merchantForm: MerchantCreate | undefined;
  public ownerForm: OwnerCreate | undefined;



  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    ) {}

  handleFormSubmitMerchantForm(merchantForm: MerchantCreate | undefined) {
    this.merchantForm = merchantForm
  }

  handleFormSubmitOwnerForm(ownerForm: OwnerCreate | undefined) {
    this.ownerForm = ownerForm
  }

  

  onSubmit() {
      if (this.ownerForm && this.merchantForm) {
          const merchantOwnerCreation: MerchantOwnerCreation = {
            merchant: this.merchantForm,
            owner: this.ownerForm
          }
          this.isLoading = true;

          console.log(
            merchantOwnerCreation
          )
          this.authService.createMerchant(merchantOwnerCreation).subscribe({
            next: (response) => {
              const tokenResponse = response;
              console.log(tokenResponse)
              this.isLoading = false;
              this.router.navigate(['/admin']);
            },
            error: (error) => {
              console.error('Error:', error);
              this.dialog.open(DialogErrorContentComponent, {data: {
                message: error.error.detail
              }})
              this.isLoading = false;
            }
          });
      }
  }
}
