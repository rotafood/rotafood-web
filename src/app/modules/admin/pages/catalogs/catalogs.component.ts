import { Component } from '@angular/core';
import { CatalogsService } from '../../../../core/services/catalogs/catalogs.service';
import { CatalogDto } from '../../../../core/interfaces/catalog';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorContentComponent } from '../../../../shared/dialog-error-content/dialog-error-content.component';
import { CatalogContext } from '../../../../core/enums/catalog-context';
import { catalogContextToString } from '../../../../core/mappers/catalog-context-to-string';
import { CategoriesService } from '../../../../core/services/cetegories/categories.service';
import { CategoryDto, GetCategoryDto } from '../../../../core/interfaces/category';
import { ItemDto } from '../../../../core/interfaces/item';
import { ItemUpdateOrCreateDialogComponent } from '../../components/item-update-or-create-dialog/item-update-or-create-dialog.component';
import { statusToString } from '../../../../core/enums/status';
import { CategoryDefaultOrPizzaDialogComponent } from '../../components/category-default-or-pizza-dialog/category-default-or-pizza-dialog.component';
import { ItemPreparedOrInstructedDialogComponent } from '../../components/item-prepared-or-instructed-dialog/item-prepared-or-instructed-dialog.component';
import { CanDeleteDialogComponent } from '../../../../shared/can-delete-dialog/can-delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OptionGroupUpdateOrCreateDialogComponent } from '../../components/option-group-update-or-create-dialog/option-group-update-or-create-dialog.component';
import { numberToString, stringToNumber } from '../../../../core/helpers/string-number-parser';
import { ItemsService } from '../../../../core/services/items/items.service';
import { ContextModifierDto } from '../../../../core/interfaces/context-modifier';
import { CategoryUpdateOrCrateDialogComponent } from '../../components/category-update-or-crate-dialog/category-update-or-crate-dialog.component';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrl: './catalogs.component.scss'
})
export class CatalogsComponent {
  public catalogs: CatalogDto[] = []
  public categories: GetCategoryDto[] = []
  public isLoading = false
  public statusToString = statusToString;
  public activeTabIndex: number = 0;
  public displayedColumns: string[] = ['image', 'name', 'status', 'price', 'actions'];

  
  public catalogContextToString(context: CatalogContext) {
    return catalogContextToString[context]
  }

  constructor(
    private readonly catalogsService: CatalogsService,
    private readonly itemsService: ItemsService,
    private readonly categoriesService: CategoriesService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
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

    if (category) {
      this.dialog.open(CategoryUpdateOrCrateDialogComponent, {
        data: category,
        width: '50vw',
        height: '50vh'
      }).afterClosed().subscribe(() => {this.loadData()})
    } else {
      this.dialog.open(CategoryDefaultOrPizzaDialogComponent, {
        data: category,
        width: '50vw',
        height: '50vh'
      }).afterClosed().subscribe(() => {this.loadData()})
    }
  }

  public formatPrice(value?: number) {
    return numberToString(value, 2, 'R$: ')
  }

  public onPriceChange(item: ItemDto, contextModifier: ContextModifierDto, event: EventTarget | null): void {
  }

  public createItemPreparedOrInstructedDialog(data: { item: ItemDto | null; categoryId: string }) {
    this.dialog.open(ItemPreparedOrInstructedDialogComponent, {
      data: data,
      width: '50vw',
      height: '50vh'
    }).afterClosed().subscribe((value) => this.loadData())
  }

  public updateOrCreateItemDefault(data: { item: ItemDto | null; categoryId: string }) {
    this.dialog.open(ItemUpdateOrCreateDialogComponent, {
      data: data,
      width: '90vw',
      height: '90vh'
    }).afterClosed().subscribe((value) => this.loadData())
  }

  public updateOrCreateOptionGroup(){

    this.dialog.open(OptionGroupUpdateOrCreateDialogComponent, {
      width: '90vw',
      height: '90vh'
    }).afterClosed().subscribe((value) => this.loadData())
  }

  public deleteCategory(category: CategoryDto | GetCategoryDto) {
      const dialogRef = this.dialog.open(CanDeleteDialogComponent, {
        data: { message: `Tem certeza que deseja deletar a categoria "${category.name}"?` }
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.categoriesService.deleteById(category.id).subscribe({
            next: () => {
              this.loadData()
              this.snackBar.open('Categoria deletada com sucesso!', 'Fechar', {
                duration: 3000,
              });
            },
            error: () => {
              this.snackBar.open('Ocorreu um erro ao deletar a categoria.', 'Fechar', {
              });
            }
          });
        }
      });
  }

  deleteItem(data: { item: ItemDto | null; categoryId: string }) {
    const dialogRef = this.dialog.open(CanDeleteDialogComponent, {
      data: { message: `Tem certeza que deseja deletar o item "${data.item?.product?.name}"?` }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.itemsService.deleteById(data.item?.id as string).subscribe({
          next: () => {
            this.loadData()
            this.snackBar.open('Item deletado com sucesso!', 'Fechar', {
              duration: 3000,
            });
          },
          error: () => {
            this.snackBar.open('Ocorreu um erro ao deletar o item.', 'Fechar', {
            });
          }
        });
      }
    });
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
 