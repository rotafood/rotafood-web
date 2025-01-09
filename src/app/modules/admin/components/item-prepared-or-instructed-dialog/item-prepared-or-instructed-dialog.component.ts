import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItemInstructedSelectorDialogComponent } from '../item-instructed-selector-dialog/item-instructed-selector-dialog.component';
import { ItemDto } from '../../../../core/interfaces/item';
import { ItemDefaultUpdateOrCreateDialogComponent } from '../item-default-update-or-create-dialog/item-default-update-or-create-dialog.component';

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

    this.dialog.open(ItemDefaultUpdateOrCreateDialogComponent, {
      width: '90vw',
      data: this.data,
      height: '90vh'
    });
  }

  createInstructedItem(): void {
    this.dialog.open(ItemInstructedSelectorDialogComponent, {
      width: '90vw',
      height: '90vh',
      data: this.data

    });
  }

  onClose() {
    this.dialogRef.close()
  }
}
