import { Component } from '@angular/core';
import { ProductCategoryService } from '../../../../../core/services/product-category/product-category.service';
import { ProductCategory } from '../../../../../core/interfaces/product-category';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrl: './product-category-list.component.scss'
})
export class ProductCategoryListComponent {
    public productCategories: ProductCategory[] = []
    constructor(
      private categoryService: ProductCategoryService
    ){
      this.categoryService.getProductCategories().subscribe(
        {next: (response) => {
           response;
          console.log(response)
  
        },
        error: (error) => {
          console.error('Error:', error);
  
      }}
      )
    }
  
}
