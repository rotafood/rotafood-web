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
import { Status, statusToString } from '../../../../core/enums/status';
import { CategoryDefaultOrPizzaDialogComponent } from '../../components/category-default-or-pizza-dialog/category-default-or-pizza-dialog.component';
import { ItemPreparedOrInstructedDialogComponent } from '../../components/item-prepared-or-instructed-dialog/item-prepared-or-instructed-dialog.component';
import { CanDeleteDialogComponent } from '../../../../shared/can-delete-dialog/can-delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OptionGroupUpdateOrCreateDialogComponent } from '../../components/option-group-update-or-create-dialog/option-group-update-or-create-dialog.component';
import { numberToString, stringToNumber } from '../../../../core/helpers/string-number-parser';
import { ItemsService } from '../../../../core/services/items/items.service';
import { ContextModifierDto } from '../../../../core/interfaces/context-modifier';
import { CategoryUpdateOrCrateDialogComponent } from '../../components/category-update-or-crate-dialog/category-update-or-crate-dialog.component';
import { TempletaType } from '../../../../core/enums/template-type';
import { ItemPizzaCreateOrUpdateDialogComponent } from '../../components/item-pizza-create-or-update-dialog/item-pizza-create-or-update-dialog.component';
import { PizzaToppingsUpdateOrCreateDialogComponent } from '../../components/pizza-toppings-update-or-create-dialog/pizza-toppings-update-or-create-dialog.component';
import { ItemDefaultUpdateOrCreateDialogComponent } from '../../components/item-default-update-or-create-dialog/item-default-update-or-create-dialog.component';
import { OptionDto } from '../../../../core/interfaces/option';
import { ProductOptionGroupDto } from '../../../../core/interfaces/product-option-group';
import { ContextModifiersService } from '../../../../core/services/context-modifiers/context-modifiers.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ProductsService } from '../../../../core/services/products/products.service';


@Component({
  selector: 'app-catalogs-list-page',
  templateUrl: './catalogs-list-page.component.html',
  styleUrl: './catalogs-list-page.component.scss'
})
export class CatalogsListPageComponent {
  public catalogs: CatalogDto[] = []
  public categories: any[] = []
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
    private readonly productsService: ProductsService,
    private readonly dialog: MatDialog,
    private readonly contextModifiersService: ContextModifiersService,
    private readonly snackbar: MatSnackBar
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
        this.categories = response
        const defaultCategories = response.filter(ct => ct.template === TempletaType.DEFAULT);
        let pizzaCategories = response.filter(ct => ct.template === TempletaType.PIZZA);
        pizzaCategories = pizzaCategories.map(ct => {
          return {
            ...ct,
            toppings: this.getToppingOptions(ct)
          }
        })

        this.categories = [...defaultCategories, ...pizzaCategories]

        

        this.isLoading = false;
      },
      error: (errors) => {
        console.error('Error:', errors);
        this.isLoading = false;
      }
    })
  }

  public allowOnlyNumbersAndComma(event: KeyboardEvent): void {
    const allowedCharacters = /[0-9,]/;
    const key = event.key;
  
    if (!allowedCharacters.test(key)) {
      event.preventDefault();
    }
  }

  public deleteOption(option: OptionDto) {

    
    this.productsService.delete(option.product.id as string).subscribe({
      next: () => {
        this.snackbar.open('Sabor removido com sucesso!', 'Fechar', { duration: 3000 });
        location.reload()
      },
      error: errors => {
        this.snackbar.open(errors.error || 'Erro ao remover o sabor.', 'Fechar', { duration: 3000 });
      }
    });
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
      }).afterClosed().subscribe(() => {this.loadData()})
    }
  }

  public formatPrice(value?: number) {
    return numberToString(value, 2, 'R$: ')
  }

  public onPriceChange(contextModifier: ContextModifierDto, event: EventTarget | null): void {
    const inputElement = event as HTMLInputElement;
    const rawValue = inputElement.value;
  
    const numericValue = stringToNumber(rawValue);
  
    if (isNaN(numericValue)) {
      inputElement.value = numberToString(0);
      return;
    }
  
    const formattedValue = numberToString(numericValue);
  
    inputElement.value = formattedValue;

    contextModifier.price.value = numericValue

    this.contextModifiersService.updateOrCreate(contextModifier).subscribe({
      next: response => {
        contextModifier = response
        this.snackbar.open('O preço atualizado com sucesso!', 'fechar', { duration: 3000 });
      },
      error: errors => {
        this.snackbar.open(errors.error || 'Erro ao atualizar o preço.', 'fechar');
      }
    })
  }

  public onStatusChange(contextModifier: ContextModifierDto, event: MatSlideToggleChange): void {
    contextModifier.status = event.checked ? Status.AVALIABLE : Status.UNAVAILABLE

    this.contextModifiersService.updateOrCreate(contextModifier).subscribe({
      next: response => {
        contextModifier = response
        this.snackbar.open('O status atualizado com sucesso!', 'fechar', { duration: 3000 });
      },
      error: errors => {
        this.snackbar.open(errors.error || 'Erro ao atualizar o status.', 'fechar');
      }
    })
  }
  

  public createItemPreparedOrInstructedDialog(data: { item: ItemDto | null; categoryId: string }) {
    this.dialog.open(ItemPreparedOrInstructedDialogComponent, {
      data: data,
      width: '50vw',
      height: '50vh'
    }).afterClosed().subscribe((value) => this.loadData())
  }

  public updateOrCreateItemPizzaTopping(data: {item: ItemDto, option?: OptionDto}) {
    this.dialog.open(PizzaToppingsUpdateOrCreateDialogComponent, {
      data: data,
      width: '90vw',
      height: '90vh'
    }).afterClosed().subscribe((value) => this.loadData())
  }

  public updateOrCreateItemDefault(data: { item: ItemDto | null; categoryId: string }) {
    this.dialog.open(ItemDefaultUpdateOrCreateDialogComponent, {
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

  deleteItem(data: { item: ItemDto | null; categoryId: string }) {
    const dialogRef = this.dialog.open(CanDeleteDialogComponent, {
      data: { message: `Tem certeza que deseja deletar o item "${data.item?.product?.name}"?` }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.itemsService.deleteById(data.item?.id as string).subscribe({
          next: () => {
            this.loadData()
            this.snackbar.open('Item deletado com sucesso!', 'Fechar', {
              duration: 3000,
            });
          },
          error: () => {
            this.snackbar.open('Ocorreu um erro ao deletar o item.', 'Fechar', {
            });
          }
        });
      }
    });
  }

  getToppingOptions(category: GetCategoryDto): any {
    const pizzaItem = category.items[0];
  
    const toppingGroup = pizzaItem.product.optionGroups?.find(
      (group: ProductOptionGroupDto) => group.optionGroup.optionGroupType === 'TOPPING'
    )
  
    return (
      toppingGroup?.optionGroup?.options.map((option: OptionDto) => ({
        id: option.id,
        status: option.status,
        index: option.index || 0,
        contextModifiers: option.contextModifiers || [],
        fractions: option.fractions || [],
        product: option.product,
      })) || []
    );
  }

  public getSizeOption(category: GetCategoryDto, parentOptionId: string) {
    const pizzaItem = category.items[0];

    const sizeGroup = pizzaItem.product.optionGroups?.find(
      (group: ProductOptionGroupDto) => group.optionGroup.optionGroupType === 'SIZE'
    )
    return sizeGroup?.optionGroup.options.find(op => op.id === parentOptionId)
  }
  

}
 
