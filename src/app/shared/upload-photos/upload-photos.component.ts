import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-upload-photos',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './upload-photos.component.html',
  styleUrl: './upload-photos.component.scss'
})
export class UploadPhotosComponent {

  public images: File[] | null = null
  public imagesUrl: string[] | null = null

  @Output() selectImages = new EventEmitter<File[] | null>();

  onMultipleFilesSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.imagesUrl = Array.from(fileList).map(file => URL.createObjectURL(file));
      this.images = Array.from(fileList).map(file => file);
      this.selectImages.emit(this.images);
    } else {
      this.imagesUrl = [];
      this.images = []
    }
  }

}
