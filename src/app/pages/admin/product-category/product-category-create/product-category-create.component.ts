import { Component } from '@angular/core';
import { ProductCategoryService } from '../../../../core/services/product-category/product-category.service';
import { ProductCategoryFormService } from '../../../../core/services/product-category-form/product-category-form.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-category-create',
  templateUrl: './product-category-create.component.html',
  styleUrl: './product-category-create.component.scss'
})
export class ProductCategoryCreateComponent {
  public isLoading: boolean = false

  constructor(
    private categoryService:ProductCategoryService,
    public categoryForm: ProductCategoryFormService,
    private location: Location
  ) {}

  onSubmit() {}

  back() {
    this.location.back()
  }
}

