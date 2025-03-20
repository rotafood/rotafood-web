import { Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { ItemsService } from '../../../../../core/services/items/items.service';
import { CategoriesService } from '../../../../../core/services/cetegories/categories.service';
import { MatDialog } from '@angular/material/dialog';
import { ContextModifiersService } from '../../../../../core/services/context-modifiers/context-modifiers.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FullCategoryDto } from '../../../../../core/interfaces/category';
import { ItemDto } from '../../../../../core/interfaces/item';
import { CanDeleteDialogComponent } from '../../../../../shared/can-delete-dialog/can-delete-dialog.component';
import { ItemPreparedOrInstructedDialogComponent } from '../../../components/item-prepared-or-instructed-dialog/item-prepared-or-instructed-dialog.component';
import { PizzaToppingsUpdateOrCreateDialogComponent } from '../../../components/pizza-toppings-update-or-create-dialog/pizza-toppings-update-or-create-dialog.component';
import { OptionDto } from '../../../../../core/interfaces/option';
import { OptionGroupType } from '../../../../../core/enums/option-group-type';
import { ItemDefaultCreateOrUpdateDialogComponent } from '../../../components/item-default-create-or-update-dialog/item-default-create-or-update-dialog.component';
import { numberToString } from '../../../../../core/helpers/string-number-parser';
import { ContextModifierDto } from '../../../../../core/interfaces/context-modifier';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Status } from '../../../../../core/enums/status';
import { CatalogContext } from '../../../../../core/enums/catalog-context';
import { catalogContextToString } from '../../../../../core/mappers/catalog-context-to-string';
import { MatTable } from '@angular/material/table';
import { OptionGroupsService } from '../../../../../core/services/option-groups/option-groups.service';

@Component({
  selector: 'app-category-items-table',
  templateUrl: './category-items-table.component.html',
  styleUrl: './category-items-table.component.scss'
})
export class CategoryItemsTableComponent {

  @Input()
  category!: FullCategoryDto;

  @Input()
  catalog!: CatalogContext;

  @ViewChild('pizzaTable') pizzaTable!: MatTable<any>;
  @ViewChild('defaultTable') defaultTable!: MatTable<any>;

  @Output()
  categoryUpdated = new EventEmitter<FullCategoryDto>();



  constructor(
    private readonly itemsService: ItemsService,
    private readonly categoriesService: CategoriesService,
    private readonly dialog: MatDialog,
    private readonly contextModifiersService: ContextModifiersService,
    private readonly snackbar: MatSnackBar,
    private readonly optionGroupsService: OptionGroupsService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category']) {
      this.category = changes['category'].currentValue
      this.renderTables()
    }
  }

  public catalogContextToString(context: CatalogContext) {
    return catalogContextToString[context]
  }

  public findParentOptionName(parentOptionId: string): string | null {
    const item = this.category.items.at(0)
    if (!item?.product.optionGroups) return null;
    for (const group of item.product?.optionGroups) {
      for (const option of group.optionGroup.options) {
        if (option.id === parentOptionId) {
          return option.product?.name || 'Sem nome';
        }
      }
    }
    return null;
  }
  

  public sortItemsInCategory(categoryId: string | undefined): void {
    if (!this.category) return;

    const sortedItems = this.category.items.map((item, index) => ({
      id: item.id,
      index
    }));

    this.categoriesService.sortItemsInCategory(categoryId, sortedItems).subscribe({
      next: () => {
        this.snackbar.open('Itens reordenados com sucesso!', 'Fechar', { duration: 3000 })
        this.renderTables()
      },
      error: errors => this.snackbar.open(errors.error || 'Erro ao reordenar itens.', 'Fechar')
    });
  }

  public moveItemUp(categoryId: string | undefined, index: number): void {
  }

  public moveItemDown(categoryId: string | undefined, index: number): void {
  }

  public moveOptionUp(categoryId: string | undefined, index: number): void {
  }

  public moveOptionDown(option: OptionDto, index: number): void {
  }

  public createItemPreparedOrInstructedDialog(data: { item: ItemDto | null; categoryId: string | undefined }) {
    this.dialog.open(ItemPreparedOrInstructedDialogComponent, {
      data: data,
      width: '50vw',
      height: '50vh'
    }).afterClosed().subscribe((updatedItem: ItemDto) => {
      if (updatedItem) {
        const index = this.category.items.findIndex(i => i.id === updatedItem.id);
        if (index >= 0) {
          this.category.items[index] = updatedItem;
        } else {
          this.category.items.push(updatedItem);
        }
        this.renderTables();
      }
    });
  }

  public updateOrCreateItemPizzaTopping(data: { item: ItemDto, option?: OptionDto }) {
    this.dialog.open(PizzaToppingsUpdateOrCreateDialogComponent, {
      data: data,
      width: '90vw',
      height: '90vh'
    }).afterClosed().subscribe((updatedItem: ItemDto) => {
      if (updatedItem) {
        const index = this.category.items.findIndex(i => i.id === updatedItem.id);
        if (index >= 0) {
          this.category.items[index] = updatedItem;
        } else {
          this.category.items.push(updatedItem);
        }
        this.renderTables();
      }
    });
  }




  public deleteItem(data: { item: ItemDto | null; categoryId: string | undefined }) {
    const dialogRef = this.dialog.open(CanDeleteDialogComponent, {
      data: { message: `Tem certeza que deseja deletar o item "${data.item?.product?.name}"?` }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.itemsService.deleteById(data.item?.id as string).subscribe({
          next: () => {
            this.category.items = this.category.items.filter(item => item.id !== data.item?.id);
            this.renderTables();
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

  public getToppingFromCategoryPizza(category: FullCategoryDto) {
    return category.items.at(0)?.product.optionGroups?.find(og => og.optionGroup.optionGroupType === OptionGroupType.TOPPING)?.optionGroup.options ?? []
  }

  public updateOrCreateItemDefault(data: { item: ItemDto | null; categoryId: string | undefined }) {
    this.dialog.open(ItemDefaultCreateOrUpdateDialogComponent, {
      data: data,
      width: '90vw',
      height: '90vh'
    }).afterClosed().subscribe((updatedItem: ItemDto) => {
      if (updatedItem) {
        const index = this.category.items.findIndex(i => i.id === updatedItem.id);
        if (index >= 0) {
          this.category.items[index] = updatedItem;
        } else {
          this.category.items.push(updatedItem);
        }
        this.renderTables();
      }
    });
  }

  public formatPrice(value?: number) {
    return numberToString(value, 2)
  }

  public onPriceChange(contextModifier: ContextModifierDto, event: number): void {
    contextModifier.price.value = event

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
    contextModifier.status = event.checked ? Status.AVAILIABLE : Status.UNAVAILABLE

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

  private renderTables() {
    if (this.category.template === 'PIZZA' && this.pizzaTable) {
      this.pizzaTable.renderRows();
    } else if (this.category.template === 'DEFAULT' && this.defaultTable) {
      this.defaultTable.renderRows();
    }
  }
}