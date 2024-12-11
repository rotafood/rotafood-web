import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OptionGroupDto } from '../../../../core/interfaces/option-group';
import { OptionDto } from '../../../../core/interfaces/option';
import { Status } from '../../../../core/enums/status';

@Component({
  selector: 'app-option-group-update-or-create-dialog',
  templateUrl: './option-group-update-or-create-dialog.component.html',
  styleUrls: ['./option-group-update-or-create-dialog.component.scss']
})
export class OptionGroupUpdateOrCreateDialogComponent {
  optionGroupForm: FormGroup;
  statusOptions = Object.values(Status);


  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<OptionGroupUpdateOrCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OptionGroupDto | null
  ) {
    this.optionGroupForm = this.fb.group({
      id: [data?.id ?? null],
      name: [data?.name ?? '', Validators.required],
      status: [data?.status ?? Status.AVALIABLE, Validators.required],
      options: this.fb.array(data?.options?.map(option => this.createOptionForm(option)) ?? [])
    });
  }

  get optionsFormArray(): FormArray {
    return this.optionGroupForm.get('options') as FormArray;
  }

  createOptionForm(option?: OptionDto): FormGroup {
    return this.fb.group({
      id: [option?.id ?? null],
      status: [option?.status ?? Status.AVALIABLE, Validators.required],
      name: [option?.product?.name ?? '', Validators.required],
      photo: [option?.product?.imagePath ?? '', Validators.required], // Novo campo photo
      price: this.fb.group({
        id: [option?.price?.id ?? null],
        value: [option?.price?.value ?? null],
        originalValue: [option?.price?.originalValue ?? null],
      }),
      product: this.fb.group({
        id: [option?.product?.id ?? null],
        description: [option?.product?.description ?? ''],
      }),
    });
  }

  addOption(): void {
    this.optionsFormArray.push(this.createOptionForm());
  }

  removeOption(index: number): void {
    this.optionsFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.optionGroupForm.valid) {
      this.dialogRef.close(this.optionGroupForm.value);
    } else {
      console.error('Formulário inválido!');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
