import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { DialogErrorContentComponent } from '../../../../shared/dialog-error-content/dialog-error-content.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Login } from '../../../../core/interfaces/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
    isLoading: boolean = false;

    form = new FormGroup({
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', [Validators.required])
    })
    
    constructor(
      private authService: AuthService,
      private router: Router,
      private dialog: MatDialog,

    ) {}

    onSubmit() {
      if (this.form.valid) {
        this.isLoading = true
        this.authService.login(this.form.value as Login).subscribe({
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
