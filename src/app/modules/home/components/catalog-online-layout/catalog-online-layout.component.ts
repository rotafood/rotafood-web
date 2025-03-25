import { Component, Input } from '@angular/core';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { ShowCatalogOnlineSideNavService } from '../../../../core/services/show-catalog-online-side-nav.service';
import { SharedOrderService } from '../../../../core/services/shared-order.service';
import { FullOrderDto } from '../../../../core/interfaces/full-order';
import { FullMerchantDto } from '../../../../core/interfaces/full-merchant';
import { OrderItemDto } from '../../../../core/interfaces/order-item';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogOnlineService } from '../../../../core/services/catalog-online.service';
import { ShiftDto } from '../../../../core/interfaces/shift';
import { getHasOpened } from '../../../../core/helpers/get-has-opened';

@Component({
  selector: 'app-catalog-online-layout',
  templateUrl: './catalog-online-layout.component.html',
  styleUrls: ['./catalog-online-layout.component.scss']
})
export class CatalogOnlineLayoutComponent {
  @Input()
  public showItemsButton: boolean = true
  @Input() merchant: FullMerchantDto | undefined = undefined;
  public order: FullOrderDto | null = null;
  public orderItems: OrderItemDto[] = [];
  public totalPrice = 0;
  public showNav = false;
  public isMobile = false;
  public hasOpened = false

  constructor(
    public windowService: WindowWidthService,
    public sideNavService: ShowCatalogOnlineSideNavService,
    private catalogOnlineService: CatalogOnlineService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedOrderService: SharedOrderService
  ) {
    this.sideNavService.currentShowNav.subscribe(showNav => this.showNav = showNav);
    this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);
    this.sharedOrderService.order$.subscribe(order => this.order = order);
    this.sharedOrderService.items$.subscribe(items => {
      this.orderItems = items;
      this.calculateTotal();
    });

    this.route.paramMap.subscribe(params => {
      const onlineName = params.get('onlineName');
      if (onlineName) {
        this.catalogOnlineService.getMerchantByOnlineName(onlineName).subscribe({
          next: (response) => {
            this.merchant = response

            this.hasOpened = getHasOpened(response);
          }
        })
      }
    });
  }

  getFormattedOpeningHours(shifts: ShiftDto[]) {


    const daysMap = {
      monday: "Segunda",
      tuesday: "Terça",
      wednesday: "Quarta",
      thursday: "Quinta",
      friday: "Sexta",
      saturday: "Sábado",
      sunday: "Domingo"
    } as const;
  
    const result: { days: string, startTime: string, endTime: string }[] = [];
  
    shifts.forEach(shift => {
      const days = (Object.keys(daysMap) as Array<keyof typeof daysMap>) 
        .filter(day => shift[day]) 
        .map(day => daysMap[day]);
  
      if (days.length) {
        result.push({
          days: days.join(", "),
          startTime: shift.startTime,
          endTime: shift.endTime
        });
      }
    });  
    return result;
  }

  getHours(shifts?: ShiftDto[]) {
    if(shifts) {
      return shifts.at(0)?.endTime
    }
    return ''
  }

  toggleSideNav() {
    this.sideNavService.toggleNav();
  }

  removeItem(index: number) {
    this.sharedOrderService.removeItemByIndex(index);
  }

  increaseQuantity(index: number) {
    this.sharedOrderService.increaseQuantityByIndex(index);
  }

  decreaseQuantity(index: number) {
    this.sharedOrderService.decreaseQuantityByIndex(index);
  }

  calculateTotal() {
    this.totalPrice = this.orderItems.reduce((total, item) => total + item.totalPrice, 0);
  }


  goToReview(): void {
    this.sideNavService.toggleNav()
    const currentUrl = this.router.url; 
    this.router.navigateByUrl(`${currentUrl}/revisar-pedido`);
  }
  
}
