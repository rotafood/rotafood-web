import { Component } from '@angular/core';
import { FullOrderDto } from '../../../../core/interfaces/full-order';
import { OrderItemDto } from '../../../../core/interfaces/order-item';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { ShowCatalogOnlineSideNavService } from '../../../../core/services/show-catalog-online-side-nav.service';
import { SharedOrderService } from '../../../../core/services/shared-order.service';
import { FullMerchantDto } from '../../../../core/interfaces/full-merchant';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressDto } from '../../../../core/interfaces/address';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDeliveryBy, OrderDeliveryMode, OrderSalesChannel, OrderStatus, OrderTakeoutMode, OrderTiming, OrderType } from '../../../../core/interfaces/order-enum';
import { PaymentMethodType } from '../../../../core/enums/payment-method-type';
import { PaymentType } from '../../../../core/enums/payment-type';
import { OrderDeliveryDto } from '../../../../core/interfaces/order-delivery';
import { CatalogOnlineService } from '../../../../core/services/catalog-online.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeoJSONSourceSpecification, LngLatLike } from 'maplibre-gl';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-review-order-page',
  templateUrl: './review-order-page.component.html',
  styleUrl: './review-order-page.component.scss'
})
export class ReviewOrderPageComponent {

  public merchant: FullMerchantDto | undefined = undefined;
  public order: FullOrderDto | undefined = undefined;
  public orderItems: OrderItemDto[] = [];
  public deliveryRadiusGeoJson: any | null = null;
  public routeGeoJson: any | null = null;
  public routeCatlogContext: string | undefined = undefined;
  public showNav = false;
  public isMobile = false;
  public merchantCenter: LngLatLike | null = null;
  public userCenter: LngLatLike | null = null;
  public totalPrice = 0;
  public freightValue = 0.0


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

  private fetchMerchant(onlineName: string): void {
    this.catalogOnlineService.getMerchantByOnlineName(onlineName).subscribe({
      next: (response) => {
        this.merchant = response;
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
  
  public addressFound(address: AddressDto) {
    this.orderForm.controls.address.setValue(address);
    this.userCenter = {
      lat: address.latitude,
      lng: address.longitude
    };
    this.updateRadius();
    this.getRoute()
  }

  public getRoute() {
    this.catalogOnlineService.getDistance(
      this.merchant?.onlineName as string,
      this.orderForm.controls.address.value as AddressDto
    ).subscribe({
      next: (distanceOutDto) => {
        console.log(distanceOutDto)
        this.routeGeoJson = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: distanceOutDto.routeLine.map(coord => [coord.lng, coord.lat])
              },
              properties: {}
            }
          ]
        };

        const distanceKm = distanceOutDto.distanceMeters / 1000;
        const minTax = this.merchant?.logisticSetting?.minTax ?? 0;
        const taxPerKm = this.merchant?.logisticSetting?.taxPerKm ?? 0;
        const freightCalc = taxPerKm * distanceKm;
        this.freightValue = +(Math.max(minTax, freightCalc).toFixed(2));
      }
    });
  }  


  updateRadius() {

    if (!this.merchantCenter) return;

    const radiusKm = this.merchant?.logisticSetting?.kmRadius ?? 5;
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

  public formatPhone(value: string): void {
    if (!value) return;

    const cleaned = value.replace(/\D/g, '');

    let formattedValue = cleaned;

    if (cleaned.length > 2) {
      formattedValue = `(${cleaned.slice(0, 2)}) `;

      if (cleaned.length > 7) {
        formattedValue += `${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
      } else if (cleaned.length > 2) {
        formattedValue += cleaned.slice(2);
      }
    }

    if (this.orderForm.controls.phone.value !== formattedValue) {
      this.orderForm.controls.phone.setValue(formattedValue, { emitEvent: false });
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

  public calculateTotal() {
    const itemsTotal = this.orderItems.reduce((total, item) => total + item.totalPrice, 0);
    this.totalPrice = itemsTotal + this.freightValue;
  }

  public onOrderTypeChange() {
    if (this.orderForm.get("orderType")?.value === OrderType.TAKEOUT) {
      this.freightValue = 0
    }
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

    const message = encodeURIComponent(`
      *Novo Pedido*
      
      *Cliente:* ${customerName} (${customerPhone})
      *Tipo:* ${deliveryType}
      ${isDelivery ? ` *${address}*` : ""}
      
      *Itens do Pedido:*
      ${itemsList}
  
       *Total:* R$ ${totalAmount}
      *Forma de Pagamento:* ${paymentMethod}
  
      *Aguardando confirmação pelo app do rotafood!*
    `);

    const whatsappUrl = `https://wa.me/55${this.merchant?.phone.replace(/\D/g, '')}?text=${message}`;

    window.open(whatsappUrl, "_blank");

  }

  public submitOrder() {
    if (this.orderForm.invalid) {
      return;
    }

    const orderType = this.orderForm.value.orderType as OrderType
    const subTotal = this.orderItems.reduce((total, item) => total + item.totalPrice, 0);
    const benefits = 0;
    const additionalFees = 0;
    const orderAmount = subTotal + this.freightValue + additionalFees - benefits;

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
        deliveryFee: this.freightValue,
        orderAmount: orderAmount,
        subTotal: subTotal,
        additionalFees: additionalFees
      },
      customer: {
        ordersCountOnMerchant: 1,
        segmentation: 'REGULAR',
        name: this.orderForm.value.name!,
        document: '',
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
            prepaid: false,
            currency: 'BRL',
            type: PaymentType.OFFLINE,
            value: this.totalPrice
          }
        ],
        pending: 0,
        prepaid: this.totalPrice
      },
      items: this.orderItems
    };



    this.catalogOnlineService.createOrder(this.merchant?.onlineName as string, orderDto).subscribe({
      next: (response) => {
        this.router.navigate([`/cardapios/${this.merchant?.onlineName}/pedidos/${response.id}`]);
      },
      error: (errors) => {
        this.snackbar.open(`Erro ${errors.error.status} - ${errors.error.details}`, "Fechar", { duration: 3000 })
      }
    })

  }

}
