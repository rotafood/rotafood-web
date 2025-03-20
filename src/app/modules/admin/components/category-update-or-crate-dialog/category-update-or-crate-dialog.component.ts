import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Status } from '../../../../core/enums/status';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryDto } from '../../../../core/interfaces/category';
import { CategoriesService } from '../../../../core/services/cetegories/categories.service';
import { Router } from '@angular/router';
import { TempletaType } from '../../../../core/enums/template-type';

@Component({
  selector: 'app-category-update-or-crate-dialog',
  templateUrl: './category-update-or-crate-dialog.component.html',
  styleUrl: './category-update-or-crate-dialog.component.scss'
})
export class CategoryUpdateOrCrateDialogComponent {
  categoryForm = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl<string>('', [Validators.required]),
    template: new FormControl<TempletaType>(TempletaType.DEFAULT, [Validators.required]),
    index: new FormControl<number | null>(0, [Validators.required, Validators.min(0)]),
    status: new FormControl<Status>(Status.AVAILIABLE, [Validators.required])
  });

  constructor(
    private readonly dialogRef: MatDialogRef<CategoryUpdateOrCrateDialogComponent>,
    private readonly categoriesService: CategoriesService,
    private readonly snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDto | undefined
  ) {
    if (data) {
      this.categoryForm.setValue({
        id: data.id as string,
        name: data.name || '',
        template: data.template || TempletaType.DEFAULT,
        index: data.index || 0,
        status: data.status || Status.AVAILIABLE
      });
    }
  }
  

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.categoriesService.updateOrCreate(this.categoryForm.value as CategoryDto).subscribe({
        next: (response) => {
          this.snackbar.open('A categoria foi criada com sucesso!', 'fechar', {duration: 3000})
          this.dialogRef.close(response);
        },

        error: (errors) => {
          this.snackbar.open(errors.error, 'fechar')
        }
      })
    }
  }
}