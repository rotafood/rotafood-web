import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItemInstructedSelectorDialogComponent } from '../item-instructed-selector-dialog/item-instructed-selector-dialog.component';
import { ItemDto } from '../../../../core/interfaces/item';
import { ItemDefaultCreateOrUpdateDialogComponent } from '../item-default-create-or-update-dialog/item-default-create-or-update-dialog.component';

@Component({
  selector: 'app-item-prepared-or-instructed-dialog',
  templateUrl: './item-prepared-or-instructed-dialog.component.html',
  styleUrl: './item-prepared-or-instructed-dialog.component.scss'
})
export class ItemPreparedOrInstructedDialogComponent {

  constructor(private readonly dialog: MatDialog,
    
    @Inject(MAT_DIALOG_DATA) public data: { item: ItemDto | null; categoryId: string },
    private readonly dialogRef: MatDialogRef<ItemPreparedOrInstructedDialogComponent>,

  ) {}

  createPreparedItem(): void {

    this.dialog.open(ItemDefaultCreateOrUpdateDialogComponent, {
      width: '90vw',
      data: this.data,
      height: '90vh'
    }).afterClosed().subscribe(response => (this.dialogRef.close(response)));
  }

  createInstructedItem(): void {
    this.dialog.open(ItemInstructedSelectorDialogComponent, {
      width: '90vw',
      height: '90vh',
      data: this.data
    }).afterClosed().subscribe(response => (this.dialogRef.close(response)));
  }

  onClose() {
    this.dialogRef.close()
  }
}
