import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { User } from '../../../../core/interfaces/merchant';

@Component({
  selector: 'app-register-user-form',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatStepperModule
  ],
  templateUrl: './register-user-form.component.html',
  styleUrl: './register-user-form.component.scss'
})
export class RegisterUserFormComponent {

  @Output() formSubmit = new EventEmitter<User>();
  public userForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    name: new FormControl<string>('', Validators.required),
    phone: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
  })

  onSubmit() {
    if (this.userForm.valid) {
      this.formSubmit.emit(this.userForm.value as User);
    }
  }

   isCompleted(): boolean {
    return this.userForm.valid
  }

}
