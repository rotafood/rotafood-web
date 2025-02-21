import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MerchantAndCategoriesDto } from '../../../../core/interfaces/merchant-and-categories';
import { CatalogOnlineService } from '../../../../core/services/catalog-online.service';
import { ContextModifierDto } from '../../../../core/interfaces/context-modifier';
import { ItemDto } from '../../../../core/interfaces/item';
import { CatalogContext } from '../../../../core/enums/catalog-context';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddOrderItemDialogComponent } from '../../components/add-order-item-dialog/add-order-item-dialog.component';

@Component({
  selector: 'app-catalogs-online',
  templateUrl: './catalogs-online.component.html',
  styleUrl: './catalogs-online.component.scss'
})
export class CatalogsOnlineComponent implements OnInit {
  data: MerchantAndCategoriesDto | null = null;
  isMobile = false;


  constructor(
    private catalogOnlineService: CatalogOnlineService,
    private route: ActivatedRoute,
    private windowService: WindowWidthService,
    private dialog: MatDialog,
    private router: Router,
    public snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);

    this.route.paramMap.subscribe(params => {
      const onlineName = params.get('onlineName');
      if (onlineName) {
        this.fetchCatalog(onlineName);
      }
    });
  }

  addOrderItem(item: ItemDto, context: CatalogContext = CatalogContext.DELIVERY) {
    if (item && context) {
        this.dialog.open(AddOrderItemDialogComponent, {
            data: {item, context},
            width: this.isMobile ? "calc(100% - 30px)" : '50vw',
            height: this.isMobile ? "calc(100% - 30px)" : '50vh',
            maxWidth: "100%",
            maxHeight: "100%" 
          })
    }
  }

  private fetchCatalog(onlineName: string): void {
    this.catalogOnlineService.getCatalogByOnlineName(onlineName).subscribe({
      next: (response) => {
        this.data = response;
        console.log(this.data )
      },
      error: (errors) => {
        this.snackbar.open('Resurante não encontrado :(', 'fechar');
        this.router.navigate(['/']);

      }
    });

  }





  getDeliveryPrice(modifiers: ContextModifierDto[]): number {
    const deliveryModifier = modifiers.find(mod => mod.catalogContext === CatalogContext.DELIVERY);
    return deliveryModifier ? deliveryModifier.price.value : 0;
  }

  getOriginalPrice(modifiers: ContextModifierDto[]): number | null {
    const deliveryModifier = modifiers.find(mod => mod.catalogContext === CatalogContext.DELIVERY);
    return deliveryModifier?.price.originalValue ?? null;
  }

  hasDiscount(modifiers: ContextModifierDto[]): boolean {
    const deliveryModifier = modifiers.find(mod => mod.catalogContext === CatalogContext.DELIVERY);
    if (deliveryModifier) {
      return deliveryModifier.price.originalValue > 0;
    }
    return false;
  }

  addToCart(item: ItemDto) {
    console.log('Produto adicionado ao carrinho:', item.product.name);
  }
}
