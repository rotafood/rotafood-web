import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Status } from '../../../../core/enums/status';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryDto } from '../../../../core/interfaces/category';
import { CategoriesService } from '../../../../core/services/cetegories/categories.service';

@Component({
  selector: 'app-category-update-or-crate-dialog',
  templateUrl: './category-update-or-crate-dialog.component.html',
  styleUrl: './category-update-or-crate-dialog.component.scss'
})
export class CategoryUpdateOrCrateDialogComponent {
  categoryForm = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl<string>('', [Validators.required]),
    index: new FormControl<number | null>(0, [Validators.required, Validators.min(0)]),
    status: new FormControl<Status>(Status.AVALIABLE, [Validators.required])
  });

  constructor(
    private readonly dialogRef: MatDialogRef<CategoryUpdateOrCrateDialogComponent>,
    private readonly snackbar: MatSnackBar,
    private readonly categoriesService: CategoriesService,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDto | undefined
  ) {
    if (data) {
      this.categoryForm.setValue({
        id: data.id || null,
        name: data.name || '',
        index: data.index || 0,
        status: data.status || Status.AVALIABLE
      });
    }
  }
  

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.categoriesService.updateOrCreate(this.categoryForm.value as CategoryDto).subscribe({
        next: () => {
          this.snackbar.open('A categoria foi criada com sucesso!', 'fechar', {duration: 3000})
          this.dialogRef.close(this.categoryForm.value);
        },

        error: (errors) => {
          this.snackbar.open(errors.error, 'fechar')
        }
      })
    }
  }
}