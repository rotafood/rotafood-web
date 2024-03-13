import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product, ProductOptionGroup } from '../../../interfaces/product';
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
    multipleImages: new FormControl<string[]>([]),
    category: new FormControl<ProductCategory| null>(null),
    optionGroups: new FormControl<ProductOptionGroup[]>([])
  });

  constructor(private fb: FormBuilder) { }

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
