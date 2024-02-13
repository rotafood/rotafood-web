import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { User } from '../../../../core/interfaces/merchant';
import { RegisterUserFormService } from '../../../../core/services/register-user-form/register-user-form.service';

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


  constructor(public userForm: RegisterUserFormService) {}



}
