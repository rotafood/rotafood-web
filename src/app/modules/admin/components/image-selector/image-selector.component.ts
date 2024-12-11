import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectImageDialogComponent } from '../select-image-dialog/select-image-dialog.component';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss']
})
export class ImageSelectorComponent {
  selectedImage: string | null = null;

  constructor(private readonly dialog: MatDialog) {}

  openImageDialog(): void {
    const dialogRef = this.dialog.open(SelectImageDialogComponent, {
      width: '90vw',
      height: '90vh'
    });

    dialogRef.afterClosed().subscribe((result: string | null) => {
      if (result) {
        this.selectedImage = result;
      }
    });
  }
}
