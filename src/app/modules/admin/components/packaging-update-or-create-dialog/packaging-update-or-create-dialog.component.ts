import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PackagingDto } from '../../../../core/interfaces/packaging';
import { stringMinValidator } from '../../../../core/helpers/string-number-parser';

@Component({
  selector: 'app-packaging-update-or-create-dialog',
  templateUrl: './packaging-update-or-create-dialog.component.html',
  styleUrl: './packaging-update-or-create-dialog.component.scss'
})
export class PackagingUpdateOrCreateDialogComponent {
  packagingForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<PackagingUpdateOrCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PackagingDto
  ) {
    this.packagingForm = this.fb.group({
      id: [data?.id ?? null],
      name: [data?.name ?? '', Validators.required],
      lenghtCm: [data?.lenghtCm ?? "1,00", [Validators.required, stringMinValidator]],
      widthCm: [data?.widthCm ?? "1,00", [Validators.required, stringMinValidator]],
      thicknessCm: [data?.thicknessCm ?? "1,00", [Validators.required, stringMinValidator]]
    });
  }

  onSubmit(): void {
    if (this.packagingForm.valid) {
      this.dialogRef.close(this.packagingForm.value);
    } else {
      console.error('Formulário inválido!');
    }
  }
}