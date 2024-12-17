import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectImageDialogComponent } from './select-image-dialog/select-image-dialog.component';
import { ImageDto } from '../../../../core/interfaces/image';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss'],
})
export class ImageSelectorComponent {
  @Input()
  imagePath: string | null | undefined = null
  
  @Output()
  onSelectedImageChange = new EventEmitter<string>()

  constructor(private readonly dialog: MatDialog) {}

  openImageDialog(): void {
    const dialogRef = this.dialog.open(SelectImageDialogComponent, {
      width: '90vw',
      height: '90vh',
    });

    dialogRef.afterClosed().subscribe((result: ImageDto | null) => {
      if (result) {
        this.imagePath = result.path;
        this.onSelectedImageChange.emit(this.imagePath)
      }
    });
  }

  clearSelectedImage(): void {
    this.imagePath = null;
  }
}
