import { ChangeDetectorRef, Component } from '@angular/core';
import { CatalogsService } from '../../../../core/services/catalogs/catalogs.service';
import { CatalogDto } from '../../../../core/interfaces/catalog';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorContentComponent } from '../../../../shared/dialog-error-content/dialog-error-content.component';
import { CatalogContext } from '../../../../core/enums/catalog-context';
import { catalogContextToString } from '../../../../core/mappers/catalog-context-to-string';
import { CategoriesService } from '../../../../core/services/cetegories/categories.service';
import { CategoryDto, GetCategoryDto } from '../../../../core/interfaces/category';
import { ItemDto } from '../../../../core/interfaces/item';
import { statusToString } from '../../../../core/enums/status';
import { CategoryDefaultOrPizzaDialogComponent } from '../../components/category-default-or-pizza-dialog/category-default-or-pizza-dialog.component';
import { ItemPreparedOrInstructedDialogComponent } from '../../components/item-prepared-or-instructed-dialog/item-prepared-or-instructed-dialog.component';
import { CanDeleteDialogComponent } from '../../../../shared/can-delete-dialog/can-delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryUpdateOrCrateDialogComponent } from '../../components/category-update-or-crate-dialog/category-update-or-crate-dialog.component';
import { TempletaType } from '../../../../core/enums/template-type';
import { ItemPizzaCreateOrUpdateDialogComponent } from '../../components/item-pizza-create-or-update-dialog/item-pizza-create-or-update-dialog.component';
import { PizzaToppingsUpdateOrCreateDialogComponent } from '../../components/pizza-toppings-update-or-create-dialog/pizza-toppings-update-or-create-dialog.component';
import { OptionDto } from '../../../../core/interfaces/option';
import { ProductOptionGroupDto } from '../../../../core/interfaces/product-option-group';

@Component({
  selector: 'app-catalogs-list-page',
  templateUrl: './catalogs-list-page.component.html',
  styleUrl: './catalogs-list-page.component.scss'
})
export class CatalogsListPageComponent {
  public catalogs: CatalogDto[] = []
  public categories: GetCategoryDto[] = []
  public isLoading = false
  public statusToString = statusToString;
  public activeTabIndex: number = 0; 
  public displayedColumns: string[] = ['image', 'name', 'status', 'price', 'actions'];


  constructor(
    private readonly catalogsService: CatalogsService,
    private readonly categoriesService: CategoriesService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.isLoading = true

    this.loadData()
  }

      
  public catalogContextToString(context: CatalogContext) {
    return catalogContextToString[context]
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
        this.categories = response  
        this.isLoading = false;
      },
      error: (errors) => {
        console.error('Error:', errors);
        this.isLoading = false;
      }
    })
  }

  
  public updateOrCreateCategory(category?: GetCategoryDto, template: TempletaType = TempletaType.DEFAULT) {

    if (category && template === TempletaType.DEFAULT) {
      this.dialog.open(CategoryUpdateOrCrateDialogComponent, {
        data: category,
        width: '50vw',
        height: '50vh'
      }).afterClosed().subscribe(() => {this.loadData()})
    } else if (category && template === TempletaType.PIZZA) {
      this.dialog.open(ItemPizzaCreateOrUpdateDialogComponent, {
        data: {item: category?.items[0], categoryId: category?.items[0].categoryId},
        width: '90vw',
        height: '90vh'
      }).afterClosed().subscribe(() => {this.loadData()})
    } else {
      this.dialog.open(CategoryDefaultOrPizzaDialogComponent, {
        width: '50vw',
        height: '50vh'
      })
    }
  }

  public deleteCategory(category: CategoryDto | GetCategoryDto) {
      const dialogRef = this.dialog.open(CanDeleteDialogComponent, {
        data: { message: `Tem certeza que deseja deletar a categoria "${category.name}"?` }
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.categoriesService.deleteById(category?.id).subscribe({
            next: () => {
              this.loadData()
              this.snackbar.open('Categoria deletada com sucesso!', 'Fechar', {
                duration: 3000,
              });
            },
            error: () => {
              this.snackbar.open('Ocorreu um erro ao deletar a categoria.', 'Fechar', {
              });
            }
          });
        }
      });
  }

  public moveCategoryUp(index: number): void {
    if (index > 0) {
      [this.categories[index], this.categories[index - 1]] = [this.categories[index - 1], this.categories[index]];
      this.sortCategories();
    }
  }
  
  public moveCategoryDown(index: number): void {
    if (index < this.categories.length - 1) {
      [this.categories[index], this.categories[index + 1]] = [this.categories[index + 1], this.categories[index]];
      this.sortCategories();
    }
  }

  public sortCategories(): void {
    const sortedCategories = this.categories.map((category, index) => ({
      id: category.id,
      index
    }));
  
    this.categoriesService.sortCategories(sortedCategories).subscribe({
      next: () => this.snackbar.open('Categorias reordenadas com sucesso!', 'Fechar', { duration: 3000 }),
      error: errors => this.snackbar.open(errors.error || 'Erro ao reordenar categorias.', 'Fechar')
    });
  }

  public createItemPreparedOrInstructedDialog(data: { item: ItemDto | null; categoryId: string | undefined | undefined }) {
    this.dialog.open(ItemPreparedOrInstructedDialogComponent, {
      data: data,
      width: '50vw',
      height: '50vh'
    }).afterClosed().subscribe((value) => {})
  }

  public updateOrCreateItemPizzaTopping(data: { item: ItemDto, option?: OptionDto }) {
    this.dialog.open(PizzaToppingsUpdateOrCreateDialogComponent, {
      data: data,
      width: '90vw',
      height: '90vh'
    }).afterClosed().subscribe((value) => {})
  }
  
  
}