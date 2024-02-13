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
import { Merchant, User } from '../../core/interfaces/merchant';
import { AuthService } from '../../core/services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogErrorContentComponent } from '../../shared/dialog-error-content/dialog-error-content.component';

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
      MatDialogModule,
      RegisterMerchantFormComponent,
      RegisterUserFormComponent,
      HttpClientModule
    
  ],
  providers: [
    AuthService
  ],

  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent  {

  @ViewChild(RegisterMerchantFormComponent) merchantFormComponent!: RegisterMerchantFormComponent
  @ViewChild(RegisterUserFormComponent) userFormComponent!: RegisterUserFormComponent
  
  public loading = false;
  public chieldLoading = false;
  public merchantData!: Merchant;
  public userData!: User;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog

    ) {}

  onMerchantFormSubmit() {
      if (this.merchantFormComponent.isFormCompleted()) {
          this.merchantData = this.merchantFormComponent.onSubmit();
      }
  }

  onUserFormSubmit() {
      if (this.userFormComponent.isFormCompleted()) {
          this.userData = this.userFormComponent.onSubmit();

          this.authService.createMerchant(this.merchantData, this.userData).subscribe({
            next: (response) => {
              const tokenResponse = response;
              console.log(tokenResponse)
              this.loading = false;
              this.router.navigate(['/dash']);
            },
            error: (error) => {
              console.error('Error:', error);
              this.dialog.open(DialogErrorContentComponent, {data: {
                message: error.error.detail
              }})
              this.loading = false;
            }
          });
      }
  }
}
