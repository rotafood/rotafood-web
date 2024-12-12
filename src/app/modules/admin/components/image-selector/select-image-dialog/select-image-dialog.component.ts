import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ImagesService } from '../../../../../core/services/images.service';
import { ImageDto } from '../../../../../core/interfaces/image';

@Component({
  selector: 'app-select-image-dialog',
  templateUrl: './select-image-dialog.component.html',
  styleUrls: ['./select-image-dialog.component.scss'],
})
export class SelectImageDialogComponent implements OnInit {
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  images: ImageDto[] = [];
  selectedImage: ImageDto | null = null;

  constructor(
    private readonly imagesService: ImagesService,
    private readonly dialogRef: MatDialogRef<SelectImageDialogComponent>
  ) {}

  ngOnInit(): void {
    this.loadImages();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  uploadImage(): void {
    if (this.selectedFile) {
      this.imagesService.uploadImage(this.selectedFile).subscribe({
        next: (imageDto) => {
          this.selectedFile = null;
          this.previewUrl = null;
          this.images.push(imageDto);
          this.selectedImage = imageDto;
          this.onSave()
        },
        error: (err) => console.error('Erro ao fazer upload da imagem:', err),
      });
    }
  }

  loadImages(): void {
    this.imagesService.getImages().subscribe({
      next: (images) => {this.images = images; console.log(images)},
      error: (err) => console.error('Erro ao carregar imagens:', err),
    });
  }

  deleteImage(image: ImageDto): void {
    this.imagesService.deleteImage(image.id).subscribe({
      next: () => this.images = this.images.filter(img => img.id !== image.id),
      error: (err) => console.error('Erro ao deletar imagem:', err),
    });
  }
  resetUpload(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }
  onSelectImage(image: ImageDto): void {
    this.selectedImage = image
  }

  onSave(): void {
    this.dialogRef.close(this.selectedImage);
  }
}
