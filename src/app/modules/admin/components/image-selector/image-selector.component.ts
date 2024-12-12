import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectImageDialogComponent } from './select-image-dialog/select-image-dialog.component';
import { ImageDto } from '../../../../core/interfaces/image';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss'],
})
export class ImageSelectorComponent {
  selectedImage: ImageDto | null = null;
  
  @Output()
  onSelectedImageChange = new EventEmitter<ImageDto>()

  constructor(private readonly dialog: MatDialog) {}

  openImageDialog(): void {
    const dialogRef = this.dialog.open(SelectImageDialogComponent, {
      width: '90vw',
      height: '90vh',
    });

    dialogRef.afterClosed().subscribe((result: ImageDto | null) => {
      if (result) {
        this.selectedImage = result;
        this.onSelectedImageChange.emit(result)
      }
    });
  }

  clearSelectedImage(): void {
    this.selectedImage = null;
  }
}
