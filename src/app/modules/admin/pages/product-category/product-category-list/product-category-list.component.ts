import { Component } from '@angular/core';
import { ProductCategoryService } from '../../../../../core/services/product-category/product-category.service';
import { ProductCategory, ProductCategoryParams } from '../../../../../core/interfaces/product-category';
import { ProductCategorySearchFormService } from '../../../../../core/services/product-category/product-category-search-form/product-category-search-form.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorContentComponent } from '../../../../../shared/dialog-error-content/dialog-error-content.component';
import { LoadingSpinnerDialogComponent } from '../../../../../shared/loading-spinner-dialog/loading-spinner-dialog.component';
import { CanDeleteDialogComponent } from '../../../../../shared/can-delete-dialog/can-delete-dialog.component';




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
    this.dialog.open(LoadingSpinnerDialogComponent, { disableClose: true });
    const startTime = performance.now();
    this.categoryService.getProductCategories(searchParams).subscribe(
      {
        next: (response) => {
          console.log(`Requisição levou ${performance.now() - startTime} ms`)
          this.productCategories = response as ProductCategory[]
          this.displayedColumns = [...Object.keys(this.productCategories[0])]
          this.dialog.closeAll();
          if (this.productCategories.length == 0) {
            this.noContent = true
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.dialog.closeAll();

        },
      }
    )

  }

  editCategory(id: number) {
    this.router.navigate([`/admin/categorias/${id}/`])
  }

  deleteCategory(id: number) {
    const dialogRef = this.dialog.open(CanDeleteDialogComponent, {data: {
      message: 'Quer escluir esta categoria?'
    }})

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        this.categoryService.deleteProductCategoryById(id).subscribe(
          {
            next: (response) => {
              this.search()
              
            },
            error: (error) => {
              console.error('Error:', error);
              this.dialog.closeAll();
            },
          }
        );
      }
    });
  }



}
