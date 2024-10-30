import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OwnerCreate } from '../../../../../../core/interfaces/owner-create';

@Component({
  selector: 'app-register-user-form',
  templateUrl: './register-user-form.component.html',
  styleUrl: './register-user-form.component.scss'
})
export class RegisterUserFormComponent {


  form =  new FormGroup({
    name: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phone: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
  })

  @Output() formChange = new EventEmitter<OwnerCreate | undefined>();

  constructor() {
    this.form.valueChanges.subscribe(value => {
      this.formChange.emit(this.form.valid ? value as OwnerCreate : undefined);
    });
  }


}
