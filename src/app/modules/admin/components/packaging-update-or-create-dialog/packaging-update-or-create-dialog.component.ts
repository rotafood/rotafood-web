import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PackagingDto } from '../../../../core/interfaces/packaging';

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
      lenghtCm: [data?.lenghtCm ?? null, Validators.required],
      widthCm: [data?.widthCm ?? null, Validators.required],
      thicknessCm: [data?.thicknessCm ?? null, Validators.required]
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