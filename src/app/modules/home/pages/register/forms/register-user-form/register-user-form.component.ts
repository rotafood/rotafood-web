import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OwnerCreateDto } from '../../../../../../core/interfaces/owner-create';

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

  @Output() formChange = new EventEmitter<OwnerCreateDto | undefined>();

  constructor() {
    
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(value => {
      this.formChange.emit(this.form.valid ? value as OwnerCreateDto : undefined);
    });
  }

  formatPhone(value: string): void {
    if (!value) return;
  
    const cleaned = value.replace(/\D/g, '');
  
    let formattedValue = cleaned;
  
    if (cleaned.length > 2) {
      formattedValue = `(${cleaned.slice(0, 2)}) `;
  
      if (cleaned.length > 7) {
        formattedValue += `${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
      } else if (cleaned.length > 2) {
        formattedValue += cleaned.slice(2);
      }
    }
  
    if (this.form.controls.phone.value !== formattedValue) {
      this.form.controls.phone.setValue(formattedValue, { emitEvent: false });
    }
  }


}
