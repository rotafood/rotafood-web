import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryUpdateOrCrateDialogComponent } from '../category-update-or-crate-dialog/category-update-or-crate-dialog.component';
import { ItemPizzaCreateOrUpdateDialogComponent } from '../item-pizza-create-or-update-dialog/item-pizza-create-or-update-dialog.component';
import { ItemDto } from '../../../../core/interfaces/item';
import { CategoryDto, FullCategoryDto } from '../../../../core/interfaces/category';
import { TempletaType } from '../../../../core/enums/template-type';
import { Status } from '../../../../core/enums/status';

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
    this.dialog.open(CategoryUpdateOrCrateDialogComponent, {
      width: '50vw',
      height: '50vh'
    }).afterClosed().subscribe((category: FullCategoryDto) => this.dialogRef.close(category));
  }

  openCategoryPizzaDialog(): void {
    this.dialog.open(ItemPizzaCreateOrUpdateDialogComponent, {
      width: '90vw',
      height: '90vh'
    }).afterClosed().subscribe((item: ItemDto) => {
      if (item) {
        this.dialogRef.close(
          {
            id: item.categoryId,
            name: item.product.name,
            items: [item],
            index: 1,
            template: TempletaType.PIZZA,
            status: Status.AVAILIABLE
          }
        )
      } else {
        this.dialogRef.close()
      }

      
    });
  }
}
