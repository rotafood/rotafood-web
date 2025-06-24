import { Component } from '@angular/core';
import { FullOrderDto } from '../../core/interfaces/order/full-order';
import { OrderItemDto } from '../../core/interfaces/order/order-item';
import { WindowWidthService } from '../../core/services/window-width/window-width.service';
import { ShowCatalogOnlineSideNavService } from '../../core/services/show-catalog-online-side-nav/show-catalog-online-side-nav.service';
import { FullMerchantDto } from '../../core/interfaces/merchant/full-merchant';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressDto } from '../../core/interfaces/shared/address';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderDeliveryBy, OrderDeliveryMode, OrderSalesChannel, OrderStatus, OrderTakeoutMode, OrderTiming, OrderType } from '../../core/interfaces/order/order-enum';
import { PaymentMethodType } from '../../core/enums/payment-method-type';
import { PaymentType } from '../../core/enums/payment-type';
import { OrderDeliveryDto } from '../../core/interfaces/order/order-delivery';
import { CatalogOnlineService } from '../../core/services/catalog-online/catalog-online.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LngLatLike } from 'maplibre-gl';
import { formatPhone } from '../../core/helpers/format-phone';
import { RouteDto } from '../../core/interfaces/catalog/distance-out';
import { getHasOpened } from '../../core/helpers/get-has-opened';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CatalogOnlineLayoutComponent } from '../../shared/catalog-online-layout/catalog-online-layout.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { SharedOrderService } from '../../core/services/shared-order/shared-order.service';
import { FullCustomerDto } from '../../core/interfaces/order/customer';
import { CustomersService } from '../../core/services/customers/customers.service';
import { MatSelectModule } from '@angular/material/select';
import { AddressAutocompleteComponent } from '../../shared/address-autocomplete/address-autocomplete.component';

@Component({
  selector: 'app-review-order-page',
  templateUrl: './review-order-page.component.html',
  styleUrl: './review-order-page.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    CatalogOnlineLayoutComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    NgxMapLibreGLModule,
    AddressAutocompleteComponent,
    RouterModule
  ]
})
export class ReviewOrderPageComponent {

  public merchant: FullMerchantDto | undefined = undefined;
  public order: FullOrderDto | undefined = undefined;
  public orderItems: OrderItemDto[] = [];
  public routeCatlogContext: string | undefined = undefined;
  public showNav = false;
  public hasOpened = false
  public isMobile = false;
  public routeDto: RouteDto | null = null;
  public totalPrice = 0;
  public customer?: FullCustomerDto;
  public lastPhoneSearched?: string;
  public selectedAddressOption: AddressDto | null = null;
  public isEditingSelected = false;

  public orderForm = new FormGroup({
    orderType: new FormControl<OrderType>(OrderType.DELIVERY, Validators.required),
    address: new FormControl<AddressDto | null>(null, Validators.required),
    name: new FormControl<string>('', Validators.required),
    phone: new FormControl<string>('', [Validators.required]),
    paymentMethod: new FormControl<PaymentMethodType>(PaymentMethodType.CASH, Validators.required),
    extraInfo: new FormControl<string>('')
  });

  constructor(
    public windowService: WindowWidthService,
    public sideNavService: ShowCatalogOnlineSideNavService,
    private route: ActivatedRoute,
    private catalogOnlineService: CatalogOnlineService,
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
    private sharedOrderService: SharedOrderService,
    private customersService: CustomersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.sideNavService.currentShowNav.subscribe(showNav => this.showNav = showNav);
    this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);
    this.sharedOrderService.order$.subscribe(order => {
      if (order) {
        this.order = order
      }
    });
    this.sharedOrderService.items$.subscribe(items => {
      this.orderItems = items;
      this.calculateTotal();
    });

    this.activatedRoute.params.subscribe(event => {
      this.routeCatlogContext = event['catalogContext'];
    });
    this.route.paramMap.subscribe(params => {
      const onlineName = params.get('onlineName');
      if (onlineName) {
        this.fetchMerchant(onlineName);
      }
    });
  }

  fetchMerchant(onlineName: string): void {
    this.catalogOnlineService.getMerchantByOnlineName(onlineName).subscribe({
      next: (response) => {
        this.merchant = response;
        this.hasOpened = getHasOpened(this.merchant)
      },
      error: () => {
        this.snackbar.open('Restaurante não encontrado :(', 'fechar');
      }
    });
  }

  patchAddressSelected(addr: AddressDto | null) {

    if (!addr) {
      this.selectedAddressOption = null;
      this.isEditingSelected = true;
      this.orderForm.controls.address.setValue(null);
      
      this.routeDto = null;
      this.calculateTotal();
      return;
    }
    this.selectedAddressOption = addr;
    this.orderForm.controls.address.setValue(addr);
    
  }

  needCalculateDeliveryFee(): boolean {
  const value = this.orderForm.value;

  if (value.orderType !== OrderType.DELIVERY) {
    return false;
  }

  if (!value.address?.latitude || !value.address?.longitude) {
    return false;
  }

  if (!this.routeDto) {
    return true;
  }


  const feeWasCalculatedForThisAddress = 
       value.address.latitude === this.routeDto.destiny.latitude &&
       value.address.longitude === this.routeDto.destiny.longitude;

  return !feeWasCalculatedForThisAddress;
}


  getRoute() {
    if (this.selectedAddressOption === undefined || this.selectedAddressOption === null) return;

    this.catalogOnlineService
      .getDistance(this.merchant!.onlineName, this.selectedAddressOption)
      .subscribe({
        next: (routeDto) => {
          this.routeDto = routeDto;
          this.calculateTotal();
        },
        error: (error) => this.snackbar.open('Endereço com campos faltando, valide manualmente', 'Fechar', { duration: 3000 })
      });
  }

  onPhoneInputChange(value: string) {
    const formatted = formatPhone(value);

    if (this.orderForm.controls.phone.value !== formatted) {
      this.orderForm.controls.phone.setValue(formatted, { emitEvent: false });
    }

    if (formatted.length === 15 && formatted !== this.lastPhoneSearched) {
      this.lastPhoneSearched = formatted;

      this.customersService.getByPhone(formatted).subscribe({
        next: (resp) => {
          this.customer = resp;
          if (resp.name) this.orderForm.controls.name.setValue(resp.name);
        },
        error: () => {
          this.customer = undefined;
          this.selectedAddressOption = null;
        }
      });
    }
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
    const itemsTotal = this.orderItems.reduce((total, item) => total + item.totalPrice, 0);
    this.totalPrice = itemsTotal + this.getDeliveryFee();
  }

  onOrderTypeChange() {
    const addressControl = this.orderForm.get('address');
    addressControl?.setValidators(Validators.required)
    if (this.orderForm.get("orderType")?.value !== OrderType.DELIVERY) {
      addressControl?.setValidators(null);
      this.routeDto = null;
    }

    addressControl?.updateValueAndValidity();

  }

  getDeliveryFee() {
    if (this.routeDto) {
      return this.routeDto.deliveryFee
    }
    return 0
  }



  openWhatsApp(order: FullOrderDto) {
    const customerName = order.customer?.name || "Cliente";
    const customerPhone = order.customer?.phone || "Não informado";

    const isDelivery = order.type === OrderType.DELIVERY;
    const deliveryType = isDelivery ? "Entrega" : "Retirada";

    const address = order.delivery?.address
      ? `Endereço: ${order.delivery.address.formattedAddress}`
      : "Endereço: Não informado";

    const itemsList = order.items
      .map(i => `- ${i.quantity}x ${i.item.name} (R$ ${i.totalPrice.toFixed(2)})`)
      .join("\n");

    const totalAmount = order.total?.orderAmount?.toFixed(2) || "0.00";
    const paymentMethod = order.payment?.description || "Não informado";

    const trackingLink = `${window.location.origin}/cardapios/${this.merchant?.onlineName}/pedidos/${order.id}`;

    const message = encodeURIComponent(`
      *Novo Pedido*
      
      *Cliente:* ${customerName} (${customerPhone})
      *Tipo:* ${deliveryType}
      ${isDelivery ? ` *${address}*` : ""}
      
      *Itens do Pedido:*
      ${itemsList}
  
      *Total:* R$ ${totalAmount}
      *Forma de Pagamento:* ${paymentMethod}
  
      *Acompanhe seu pedido:* ${trackingLink}
  
      *Aguardando confirmação pelo app do Rotafood!*
    `);

    const whatsappUrl = `https://wa.me/55${this.merchant?.phone.replace(/\D/g, '')}?text=${message}`;

    window.open(whatsappUrl, "_blank");

    setTimeout(() => {
      this.router.navigate([`/cardapios/${this.merchant?.onlineName}/pedidos/${order.id}`]);
    }, 1000)
  }




  submitOrder() {
    if (this.orderForm.invalid) {
      return;
    }

    const orderType = this.orderForm.value.orderType as OrderType
    const subTotal = this.orderItems.reduce((total, item) => total + item.totalPrice, 0);
    const benefits = 0;
    const additionalFees = 0;
    const orderAmount = subTotal + this.getDeliveryFee() + additionalFees - benefits;

    const deliveryDto: OrderDeliveryDto | undefined = orderType === OrderType.DELIVERY
      ? {
        mode: OrderDeliveryMode.DEFAULT,
        deliveryBy: OrderDeliveryBy.MERCHANT,
        deliveryDateTime: new Date(),
        address: this.orderForm.value.address!,
      }
      : undefined;

    const orderDto: FullOrderDto = {
      type: orderType,
      status: OrderStatus.CREATED,
      salesChannel: OrderSalesChannel.ROTAFOOD,
      preparationStartDateTime: new Date(),
      timing: OrderTiming.IMMEDIATE,
      merchantId: this.merchant?.id,
      extraInfo: '',
      total: {
        benefits: benefits,
        deliveryFee: this.getDeliveryFee(),
        orderAmount: orderAmount,
        serviceFee: 0,
        subTotal: subTotal,
        additionalFees: additionalFees
      },
      customer: {
        name: this.orderForm.value.name!,
        phone: this.orderForm.value.phone!
      },
      delivery: deliveryDto,
      takeout: orderType === 'DELIVERY' ? undefined : {
        takeoutDateTime: new Date(),
        mode: OrderTakeoutMode.DEFAULT,
        comments: ''
      },
      payment: {
        id: undefined,
        description: `Pagamento via ${this.orderForm.value.paymentMethod}`,
        methods: [
          {
            description: '',
            method: this.orderForm.value.paymentMethod as PaymentMethodType,
            paid: false,
            type: PaymentType.OFFLINE,
            value: this.totalPrice
          }
        ],
        pending: 0,
        paid: this.totalPrice
      },
      items: this.orderItems,
      printed: false
    };



    this.catalogOnlineService.createOrder(this.merchant?.onlineName as string, orderDto).subscribe({
      next: (response) => {
        this.openWhatsApp(response);
      },
      error: (errors) => {
        this.snackbar.open(`Erro ${errors.error.status} - ${errors.error.details}`, "Fechar", { duration: 3000 })
      }
    })

  }

}
