import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { DefaultFormContainerComponent } from '../../shared/default-form-container/default-form-container.component';
import { DefaultLayoutComponent } from '../../layouts/default-layout/default-layout.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginFormService } from '../../core/services/login-form/login-form.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorContentComponent } from '../../shared/dialog-error-content/dialog-error-content.component';
import { SpinnerButtonComponent } from '../../shared/spinner-button/spinner-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    DefaultFormContainerComponent,
    DefaultLayoutComponent,
    MatButtonModule,
    MatFormFieldModule,
    CommonModule,
    SpinnerButtonComponent,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
    isLoading: boolean = false;
    
    constructor(
      public loginForm: LoginFormService,
      private authService: AuthService,
      private router: Router,
      private dialog: MatDialog,

    ) {}

    onSubmit() {
      if (this.loginForm.isCompleted()) {
        this.isLoading = true
        this.authService.login(this.loginForm.getData()).subscribe({
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
