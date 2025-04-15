import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogOnlineService } from '../../../../core/services/catalog-online.service';
import { ContextModifierDto } from '../../../../core/interfaces/catalog/context-modifier';
import { ItemDto } from '../../../../core/interfaces/catalog/item';
import { CatalogContext } from '../../../../core/enums/catalog-context';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddOrderItemDialogComponent } from '../../components/add-order-item-dialog/add-order-item-dialog.component';
import { ShowCatalogOnlineSideNavService } from '../../../../core/services/show-catalog-online-side-nav.service';
import { MerchantAndMenuUrlDto } from '../../../../core/interfaces/merchant/merchant-and-manu-url';
import { FullCategoryDto } from '../../../../core/interfaces/catalog/category';
import { SharedOrderService } from '../../../../core/services/shared-order.service';
import { getHasOpened } from '../../../../core/helpers/get-has-opened';

@Component({
  selector: 'app-catalog-online-context',
  templateUrl: './catalog-online-context.component.html',
  styleUrl: './catalog-online-context.component.scss'
})
export class CatalogOnlineContextComponent {
  data: MerchantAndMenuUrlDto | null = null;
  categories: FullCategoryDto[] = []
  isMobile = false;
  catalogContext = CatalogContext.DELIVERY
  hasOpened = false
  isLoading = true;



  constructor(
    private catalogOnlineService: CatalogOnlineService,
    private route: ActivatedRoute,
    private windowService: WindowWidthService,
    private sharedOrder: SharedOrderService,
    private showCatalogOnlineSideNav: ShowCatalogOnlineSideNavService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  

  ngOnInit(): void {
    this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);

    this.route.paramMap.subscribe(params => {
      const onlineName = params.get('onlineName');
      if (onlineName) {

        this.fetchCatalog(onlineName);
      }

      const catalogContext = params.get('catalogContext');
      if (catalogContext && catalogContext === 'entrega') {
        this.catalogContext  = CatalogContext.DELIVERY
      } else if(catalogContext && catalogContext === 'mesa') {
        this.catalogContext = CatalogContext.TABLE
      }
    });
  }

  addOrderItem(item: ItemDto, context: CatalogContext = CatalogContext.DELIVERY) {
    if (item && context) {
        this.dialog.open(AddOrderItemDialogComponent, {
            data: {item, context, canAdd: this.catalogContext === CatalogContext.DELIVERY},
            width: this.isMobile ? "calc(100% - 30px)" : '50%',
            height: this.isMobile ? "calc(100% - 30px)" : '90%',
            maxWidth: "100%",
            maxHeight: "100%" 
          }).afterClosed().subscribe(
            orderItem => {
            if (orderItem) {
              this.sharedOrder.addItem(orderItem);
              if (!this.showCatalogOnlineSideNav.getStatus()) {
                this.showCatalogOnlineSideNav.toggleNav()
              }
            }
          })
    }
  }

  fetchCatalog(onlineName: string): void {
    this.isLoading = true;
  
    this.catalogOnlineService.getCatalogByOnlineName(onlineName).subscribe({
      next: (response) => {
        this.data = response;
        this.hasOpened = getHasOpened(response.merchant);
        
        this.catalogOnlineService.getCategoriesFromUrl(response.menuUrl).subscribe({
          next: (response) => {
            this.categories = response;
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
            this.snackBar.open('Catálogo não encontrado :(', 'fechar');
          }
        });
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Restaurante não encontrado :(', 'fechar');
      }
    });
  }
  
  getDescriptionSlice(description: string): string {
    const maxLength = this.isMobile ? 50 : 200;
    return description.length > maxLength ? description.slice(0, maxLength) + '...' : description;
  }
  

  getDeliveryPrice(modifiers: ContextModifierDto[]): number {
    const deliveryModifier = modifiers.find(mod => mod.catalogContext === this.catalogContext);
    return deliveryModifier ? deliveryModifier.price.value : 0;
  }

  getOriginalPrice(modifiers: ContextModifierDto[]): number | null {
    const deliveryModifier = modifiers.find(mod => mod.catalogContext === this.catalogContext);
    return deliveryModifier?.price.originalValue ?? null;
  }

  hasDiscount(modifiers: ContextModifierDto[]): boolean {
    const deliveryModifier = modifiers.find(mod => mod.catalogContext === this.catalogContext);
    if (deliveryModifier) {
      return deliveryModifier.price.originalValue > 0;
    }
    return false;
  }


}