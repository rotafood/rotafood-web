import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItemUpdateOrCreateDialogComponent } from '../item-update-or-create-dialog/item-update-or-create-dialog.component';
import { ItemInstructedSelectorDialogComponent } from '../item-instructed-selector-dialog/item-instructed-selector-dialog.component';

@Component({
  selector: 'app-item-prepared-or-instructed-dialog',
  templateUrl: './item-prepared-or-instructed-dialog.component.html',
  styleUrl: './item-prepared-or-instructed-dialog.component.scss'
})
export class ItemPreparedOrInstructedDialogComponent {

  constructor(private readonly dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<ItemPreparedOrInstructedDialogComponent>,

  ) {}

  createPreparedItem(): void {
    this.dialog.open(ItemUpdateOrCreateDialogComponent, {
      width: '90vw',
      height: '90vh'
    });
  }

  createInstructedItem(): void {
    this.dialog.open(ItemInstructedSelectorDialogComponent, {
      width: '90vw',
      height: '90vh'
    });
  }

  onClose() {
    this.dialogRef.close()
  }
}
