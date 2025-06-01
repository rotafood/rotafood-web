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
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { CepAutocompleteComponent } from '../../shared/cep-autocomplete/cep-autocomplete.component';
import { SharedOrderService } from '../../core/services/shared-order/shared-order.service';
import { FullCustomerDto } from '../../core/interfaces/order/customer';
import { CustomersService } from '../../core/services/customers/customers.service';
import { MatSelect, MatSelectModule } from '@angular/material/select';

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
    CepAutocompleteComponent,
    RouterModule
  ]
})
export class ReviewOrderPageComponent {

  public merchant: FullMerchantDto | undefined = undefined;
  public order: FullOrderDto | undefined = undefined;
  public orderItems: OrderItemDto[] = [];
  public deliveryRadiusGeoJson: any | null = null;
  public routeGeoJson: any | null = null;
  public routeCatlogContext: string | undefined = undefined;
  public showNav = false;
  public hasOpened = false
  public isMobile = false;
  public merchantCenter: LngLatLike | null = null;
  public userCenter: LngLatLike | null = null;
  public routeDto: RouteDto | null = null;
  public totalPrice = 0;
  public customer?: FullCustomerDto;
  public lastPhoneSearched?: string;
  public selectedAddressOption: AddressDto | null = null;
  public isEditingSelected = false;
  private lastCoordsSignature?: string;


  public orderForm = new FormGroup({
    orderType: new FormControl<OrderType>(OrderType.DELIVERY, Validators.required),
    address: new FormControl<AddressDto | null>(null),
    name: new FormControl<string>('', Validators.required),
    phone: new FormControl<string>('', [Validators.required]),
    paymentMethod: new FormControl<PaymentMethodType>(PaymentMethodType.CASH, Validators.required)
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
        this.merchantCenter = {
          lat: response.address.latitude,
          lng: response.address.longitude
        };
        this.updateRadius();
      },
      error: () => {
        this.snackbar.open('Restaurante não encontrado :(', 'fechar');
      }
    });
  }

  patchAddressSelected(addr: AddressDto | null) {

    if (!addr) {                         // “adicionar novo endereço”
      this.selectedAddressOption = null;
      this.isEditingSelected = true;
      this.orderForm.controls.address.setValue(null);
      this.userCenter = null;
      this.lastCoordsSignature = undefined;  // força novo cálculo depois
      return;
    }

    this.selectedAddressOption = addr;
    this.isEditingSelected = false;

    this.orderForm.controls.address.setValue(addr);
    this.userCenter = { lat: addr.latitude, lng: addr.longitude };

    this.updateRadius();
    this.getRoute(addr);
  }


  getRoute(address: AddressDto) {
    const sig = `${address.latitude},${address.longitude}`;

    if (sig === this.lastCoordsSignature) {
      return;                                  // já calculado → sai
    }
    this.lastCoordsSignature = sig;            // <<< ATUALIZA aqui!

    this.catalogOnlineService
      .getDistance(this.merchant!.onlineName, address)
      .subscribe({
        next: (routeDto) => {
          this.routeDto = routeDto;
          this.routeGeoJson = {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeDto.routeLine.map(c => [c.lng, c.lat])
              },
              properties: {}
            }]
          };
          this.calculateTotal();             // se a taxa mudou
        },
        error: () => this.snackbar.open('Falha ao calcular rota', 'Fechar', { duration: 3000 })
      });
  }



  updateRadius() {

    if (!this.merchantCenter) return;

    const radiusKm = this.merchant?.logisticSetting?.maxDeliveryRadiusKm ?? 5;
    const radiusMeters = radiusKm * 1000;

    this.deliveryRadiusGeoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [this.generateCircle(this.merchantCenter as LngLatLike, radiusMeters)]
          }
        }
      ]
    };
  }


  generateCircle(center: LngLatLike, radius: number): number[][] {
    const points = 64;
    const coords: number[][] = [];
    const earthRadius = 6371000;
    const lat = (center as any).lat * Math.PI / 180;
    const lng = (center as any).lng * Math.PI / 180;

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * (2 * Math.PI);
      const dx = radius * Math.cos(angle) / earthRadius;
      const dy = radius * Math.sin(angle) / earthRadius;
      const newLat = lat + dy;
      const newLng = lng + dx / Math.cos(lat);
      coords.push([newLng * 180 / Math.PI, newLat * 180 / Math.PI]);
    }

    coords.push(coords[0]);

    return coords;
  }

  onPhoneInputChange(value: string) {
    const formatted = formatPhone(value);

    if (this.orderForm.controls.phone.value !== formatted) {
      this.orderForm.controls.phone.setValue(formatted, { emitEvent: false });
    }

    // só consulta quando o número está completo (15 caracteres) e mudou
    if (formatted.length === 15 && formatted !== this.lastPhoneSearched) {
      this.lastPhoneSearched = formatted;

      this.customersService.getByPhone(formatted).subscribe({
        next: (resp) => {
          this.customer = resp;
          // pré-preenche nome se vier do backend
          if (resp.name) this.orderForm.controls.name.setValue(resp.name);
        },
        error: () => {
          this.customer = undefined;          // não encontrado
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
    if (this.orderForm.get("orderType")?.value === OrderType.TAKEOUT) {
      this.routeDto = null
    }
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
