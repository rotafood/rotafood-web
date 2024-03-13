import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../../interfaces/product';
import { ProductCategory } from '../../../interfaces/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductFormService {
  private productForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      additionalInformation: new FormControl(''),
      serving: new FormControl(''),
      weightQuantity: new FormControl(0),
      weightUnit: new FormControl(''),
      volume: new FormControl(0),
      price: new FormControl(0),
      productType: new FormControl(''),
      image: new FormControl(''),
      multipleImages: new FormControl([]),
      category: new FormGroup({}),
      optionGroups: new FormControl([])
  });

  isCompleted(): boolean {
    return this.productForm.valid;
  }

  getData(): Product {
      return this.productForm.value as Product;
  }

  get formGroup() {
    return this.productForm;
  }

}
