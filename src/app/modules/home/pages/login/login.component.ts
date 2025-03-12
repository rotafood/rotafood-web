import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { DialogErrorContentComponent } from '../../../../shared/dialog-error-content/dialog-error-content.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginDto } from '../../../../core/interfaces/auth';
import { LogService } from '../../../../core/services/log/log.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
      private readonly authService: AuthService,
      private readonly router: Router,
      private readonly snackbar: MatSnackBar,

    ) {}

    onSubmit() {
      if (this.form.valid) {
        this.isLoading = true
        this.authService.login(this.form.value as LoginDto).subscribe({
          next: (response) => {
            const tokenResponse = response;
            this.isLoading = false;
            this.router.navigate(['/admin']);
          },
          error: (errors) => {
            console.error('Error:', errors);
            this.snackbar.open(`Erro ${errors.error.status} - ${errors.error.details}`, "Fechar", {duration: 3000})
            this.isLoading = false;
          }
        });
      }
    }
}
