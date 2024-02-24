import { Component } from '@angular/core';
import { ProductCategoryService } from '../../../../../core/services/product-category/product-category.service';
import { ProductCategory, ProductCategoryParams } from '../../../../../core/interfaces/product-category';
import { ProductCategorySearchFormService } from '../../../../../core/services/product-category/product-category-search-form/product-category-search-form.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogSuccessComponent } from '../../../../../shared/dialog-success/dialog-success.component';
import { DialogErrorContentComponent } from '../../../../../shared/dialog-error-content/dialog-error-content.component';




@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrl: './product-category-list.component.scss'
})
export class ProductCategoryListComponent {
  public productCategories: ProductCategory[] = []
  public displayedColumns: string[] = []
  public noContent = false
  public isLoading = true


  constructor(
    private categoryService: ProductCategoryService,
    private router: Router,
    private dialog: MatDialog,
    public searchForm: ProductCategorySearchFormService
  ) {

    this.search()
  }

  public search(searchParams?: ProductCategoryParams) {
    this.isLoading = true
    const startTime = performance.now();
    this.categoryService.getProductCategories(searchParams).subscribe(
      {
        next: (response) => {
          console.log(`Requisição levou ${performance.now() - startTime} ms`)
          this.productCategories = response as ProductCategory[]
          this.displayedColumns = [...Object.keys(this.productCategories[0])]
          this.isLoading = false
          if (this.productCategories.length == 0) {
            this.noContent = true
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.isLoading = false

        },
      }
    )

  }

  editCategory(id: number) {
    this.router.navigate([`/admin/categorias/${id}/`])
  }

  deleteCategory(id: number) {
    this.dialog.open(DialogErrorContentComponent, {data: {
      message: 'Ai q diliça'
    }})
  }


}
