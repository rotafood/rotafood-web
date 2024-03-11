import { Component } from '@angular/core';
import { ProductCategoryService } from '../../../../../core/services/product-category/product-category.service';
import { ProductCategory, ProductCategoryParams } from '../../../../../core/interfaces/product-category';
import { ProductCategorySearchFormService } from '../../../../../core/services/product-category/product-category-search-form/product-category-search-form.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// import { DialogErrorContentComponent } from '../../../../../shared/dialog-error-content/dialog-error-content.component';
import { LoadingSpinnerDialogComponent } from '../../../../../shared/loading-spinner-dialog/loading-spinner-dialog.component';
import { CanDeleteDialogComponent } from '../../../../../shared/can-delete-dialog/can-delete-dialog.component';
import { ColumnConfig } from '../../../../../core/interfaces/column-config';



@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrl: './product-category-list.component.scss'
})
export class ProductCategoryListComponent {
  public productCategories: ProductCategory[] = []
  public columnsConfig: ColumnConfig<keyof ProductCategory>[] = [
    { key: 'id', title: 'Contagem', visible: true },
    { key: 'name', title: 'Nome', visible: true },
    { key: 'description', title: 'Descrição', visible: true }
  ];
  public displayedColumns = this.columnsConfig.map((item) => item.key)

  public noContent = false


  constructor(
    private categoryService: ProductCategoryService,
    private router: Router,
    private dialog: MatDialog,
    public searchForm: ProductCategorySearchFormService
  ) {

    this.search()
  }

  public search(key?: string) {
    this.noContent = false
    this.dialog.open(LoadingSpinnerDialogComponent, { disableClose: true });
    let searchParams: any = {}
    if (key) {
      searchParams[key] = this.searchForm.formGroup.get(key)?.value
    }
    this.categoryService.getProductCategories(searchParams).subscribe(
      {
        next: (response) => {
          this.productCategories = response as ProductCategory[]
          this.dialog.closeAll();
          if (this.productCategories.length == 0 && searchParams === undefined) {
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

  delete(id: number) {
    const dialogRef = this.dialog.open(CanDeleteDialogComponent, {data: {
      message: 'Quer escluir esta categoria?'
    }})

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        this.categoryService.deleteProductCategoryById(id).subscribe(
          {
            next: () => {
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
