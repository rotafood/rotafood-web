import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ImagesService } from '../../../../core/services/images.service';

@Component({
  selector: 'app-select-image-dialog',
  templateUrl: './select-image-dialog.component.html',
  styleUrls: ['./select-image-dialog.component.scss']
})
export class SelectImageDialogComponent implements OnInit {
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  images: string[] = [];

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
        next: () => {
          this.loadImages();
          this.resetUpload();
        },
        error: (err) => console.error('Erro ao fazer upload da imagem:', err),
      });
    }
  }

  loadImages(): void {
    this.imagesService.getImages().subscribe({
      next: (images) => (this.images = images),
      error: (err) => console.error('Erro ao carregar imagens:', err),
    });
  }

  deleteImage(imageUrl: string): void {
    const imageId = this.extractImageId(imageUrl);
    this.imagesService.deleteImage(imageId).subscribe({
      next: () => this.loadImages(),
      error: (err) => console.error('Erro ao deletar imagem:', err),
    });
  }

  extractImageId(imageUrl: string): string {
    return imageUrl.split('/').pop() ?? '';
  }

  resetUpload(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  onSave(): void {
    this.dialogRef.close();
  }

  selectImage(imageUrl: string): void {
    this.dialogRef.close(imageUrl);
  }
}
