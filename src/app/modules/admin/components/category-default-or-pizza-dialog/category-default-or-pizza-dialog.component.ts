import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryUpdateOrCrateDialogComponent } from '../category-update-or-crate-dialog/category-update-or-crate-dialog.component';
import { ItemPizzaCreateOrUpdateDialogComponent } from '../item-pizza-create-or-update-dialog/item-pizza-create-or-update-dialog.component';

@Component({
  selector: 'app-category-default-or-pizza-dialog',
  templateUrl: './category-default-or-pizza-dialog.component.html',
  styleUrls: ['./category-default-or-pizza-dialog.component.scss']
})
export class CategoryDefaultOrPizzaDialogComponent {

  constructor(private readonly dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<CategoryDefaultOrPizzaDialogComponent>,

  ) {}

  openCategoryDefaultDialog(): void {
    this.dialogRef.close()
    this.dialog.open(CategoryUpdateOrCrateDialogComponent, {
      width: '50vw',
      height: '50vh'
    });
  }

  openCategoryPizzaDialog(): void {
    this.dialogRef.close()
    this.dialog.open(ItemPizzaCreateOrUpdateDialogComponent, {
      data: {item: null, categortyId: ''},
      width: '90vw',
      height: '90vh'
    });
  }
}
