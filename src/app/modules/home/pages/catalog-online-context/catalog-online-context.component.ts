import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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
import { Meta, Title } from '@angular/platform-browser';

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
  isLoading = false;
  selectedCategory = '';

  @ViewChild('scrollContainer') scrollContainerRef!: ElementRef;



  constructor(
    private catalogOnlineService: CatalogOnlineService,
    private route: ActivatedRoute,
    private windowService: WindowWidthService,
    private sharedOrder: SharedOrderService,
    private showCatalogOnlineSideNav: ShowCatalogOnlineSideNavService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private titleService: Title,
    private metaService: Meta
  ) {}

  

  ngOnInit(): void {
    this.updatePageMeta()
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
        this.updatePageMeta()
        this.hasOpened = getHasOpened(response.merchant);
        
        this.catalogOnlineService.getCategoriesFromUrl(response.menuUrl).subscribe({
          next: (response) => {
            this.categories = response;
            this.selectedCategory = response[0].name
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

  updatePageMeta() {
    this.titleService.setTitle(this.data?.merchant?.name || 'Cardápio Online');

        this.metaService.updateTag({
          name: 'description',
          content: this.data?.merchant?.description || 'Confira nosso cardápio online!'
        });

        this.metaService.updateTag({
          property: 'og:title',
          content: this.data?.merchant?.name || 'Cardápio Online'
        });

        this.metaService.updateTag({
          property: 'og:description',
          content: this.data?.merchant?.description || 'Confira nosso cardápio online!'
        });

        this.metaService.updateTag({
          property: 'og:image',
          content: this.data?.merchant?.imagePath || 'https://rotafood.com.br/assets/images/default-merchant.jpg'
        });

        this.metaService.updateTag({
          property: 'og:url',
          content: window.location.href
        });

        this.metaService.updateTag({
          name: 'twitter:card',
          content: 'summary_large_image'
        });

        this.metaService.updateTag({
          name: 'twitter:image',
          content: this.data?.merchant?.imagePath || 'https://rotafood.com.br/assets/images/default-merchant.jpg'
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

  scrollToCategory(name: string) {
    const element = document.getElementById(this.formatCategoryId(name));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  formatCategoryId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }


}