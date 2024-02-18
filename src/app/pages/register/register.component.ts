import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { DefaultFormContainerComponent } from '../../shared/default-form-container/default-form-container.component';
import { DefaultLayoutComponent } from '../../layouts/default-layout/default-layout.component';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { RegisterMerchantFormComponent } from './forms/register-merchant-form/register-merchant-form.component';
import { RegisterUserFormComponent } from './forms/register-user-form/register-user-form.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogErrorContentComponent } from '../../shared/dialog-error-content/dialog-error-content.component';
import { RegisterUserFormService } from '../../core/services/register-forms/register-user-form/register-user-form.service';
import { RegisterMerchantFormService } from '../../core/services/register-forms/register-merchant-form/register-merchant-form.service';
import { SpinnerButtonComponent } from '../../shared/spinner-button/spinner-button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
      MatIconModule,
      MatInputModule,
      MatButtonModule,
      RouterModule,
      DefaultFormContainerComponent,
      DefaultLayoutComponent,
      CommonModule,
      MatStepperModule,
      MatDialogModule,
      RegisterMerchantFormComponent,
      RegisterUserFormComponent,
      HttpClientModule,
      SpinnerButtonComponent
    
  ],
  providers: [
    AuthService
  ],

  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent  {


  
  public isLoading = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    public userForm: RegisterUserFormService,
    public merchantForm: RegisterMerchantFormService

    ) {}

  

  onSubmit() {
      if (this.userForm.isCompleted() && this.merchantForm.isCompleted()) {

          this.isLoading = true;
          this.authService.createMerchant(this.merchantForm.getData(), this.userForm.getData()).subscribe({
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
