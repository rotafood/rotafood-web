import { Component } from '@angular/core';
import { ProductFormService } from '../../../../../../../core/services/product/product-form/product-form.service';
import { AbstractControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {

  public images: File[] = [];

  constructor(
    public productForm: ProductFormService,

  ) {}

  onMultipleFilesSelected(images: File[] | null): void {
    if (images) {
      this.images = Array.from(images).map(file => file);
    } else {
      this.images = []
    }
  }

  onSubmit() {
  }
}
