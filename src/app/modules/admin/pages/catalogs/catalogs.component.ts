import { Component } from '@angular/core';
import { CatalogsService } from '../../../../core/services/catalogs/catalogs.service';
import { CatalogDto } from '../../../../core/interfaces/catalog';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorContentComponent } from '../../../../shared/dialog-error-content/dialog-error-content.component';
import { CatalogContext } from '../../../../core/enums/catalog-context';
import { catalogContextToString } from '../../../../core/mappers/catalog-context-to-string';
import { CategoriesService } from '../../../../core/services/cetegories/categories.service';
import { CategoryDto, GetCategoryDto } from '../../../../core/interfaces/category';
import { CategoryUpdateOrCrateDialogComponent } from '../../components/category-update-or-crate-dialog/category-update-or-crate-dialog.component';
import { ItemDto } from '../../../../core/interfaces/item';
import { ItemUpdateOrCreateDialogComponent } from '../../components/item-update-or-create-dialog/item-update-or-create-dialog.component';
import { statusToString } from '../../../../core/enums/status';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrl: './catalogs.component.scss'
})
export class CatalogsComponent {

  public catalogs: CatalogDto[] = []
  public categories: GetCategoryDto[] = []
  public isLoading = false
  public statusToString = statusToString
  
  public catalogContextToString(context: CatalogContext) {
    return catalogContextToString[context]
  }

  constructor(
    public catalogsService: CatalogsService,
    private readonly categoriesService: CategoriesService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isLoading = true

    this.loadData()
  }

  public loadData() {
    this.catalogsService.getAll().subscribe({
      next: (response) => {
        this.catalogs = response;
        this.isLoading = false;
      },
      error: (errors) => {
        console.error('Error:', errors);
        this.dialog.open(DialogErrorContentComponent, {data: {
          message: errors.error
        }})
        this.isLoading = false;
      }
    })
    this.categoriesService.getAll().subscribe({
      next: (response) => {
        this.categories = response;
        this.isLoading = false;
      },
      error: (errors) => {
        console.error('Error:', errors);
        this.isLoading = false;
      }
    })
  }

  public updateOrCreateCategory(category?: CategoryDto) {

    this.dialog.open(CategoryUpdateOrCrateDialogComponent, {
      data: category,
      width: '50vw',
      height: '50vh'
    }).afterClosed().subscribe(() => {this.loadData()})
  }

  public updateOrCreateItem(item?: ItemDto) {

    this.dialog.open(ItemUpdateOrCreateDialogComponent, {
      data: item,
      width: '90vw',
      height: '90vh'
    })
  }

  downloadQRCode(qrcodeElement: any): void {
    const canvas = qrcodeElement.qrcElement.nativeElement.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'qrcode.png';
      link.click();
    }
  }

}
 