import { Component } from '@angular/core';
import { FullOrderDto } from '../../../../core/interfaces/order/full-order';
import { OrderItemDto } from '../../../../core/interfaces/order/order-item';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { ShowCatalogOnlineSideNavService } from '../../../../core/services/show-catalog-online-side-nav.service';
import { SharedOrderService } from '../../../../core/services/shared-order.service';
import { FullMerchantDto } from '../../../../core/interfaces/merchant/full-merchant';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressDto } from '../../../../core/interfaces/address';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDeliveryBy, OrderDeliveryMode, OrderSalesChannel, OrderStatus, OrderTakeoutMode, OrderTiming, OrderType } from '../../../../core/interfaces/order/order-enum';
import { PaymentMethodType } from '../../../../core/enums/payment-method-type';
import { PaymentType } from '../../../../core/enums/payment-type';
import { OrderDeliveryDto } from '../../../../core/interfaces/order/order-delivery';
import { CatalogOnlineService } from '../../../../core/services/catalog-online.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LngLatLike } from 'maplibre-gl';
import { formatPhone } from '../../../../core/helpers/format-phone';
import { RouteDto } from '../../../../core/interfaces/catalog/distance-out';
import { getHasOpened } from '../../../../core/helpers/get-has-opened';

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
  public hasOpened = false
  public isMobile = false;
  public merchantCenter: LngLatLike | null = null;
  public userCenter: LngLatLike | null = null;
  public routeDto: RouteDto | null = null;
  public totalPrice = 0;


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
  
  addressFound(address: AddressDto) {
    this.orderForm.controls.address.setValue(address);
    this.userCenter = {
      lat: address.latitude,
      lng: address.longitude
    };
    this.updateRadius();
    this.getRoute()
  }

  getRoute() {
    this.catalogOnlineService.getDistance(
      this.merchant?.onlineName as string,
      this.orderForm.controls.address.value as AddressDto
    ).subscribe({
      next: (routeDto) => {
        console.log(routeDto)
        this.routeGeoJson = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeDto.routeLine.map(coord => [coord.lng, coord.lat])
              },
              properties: {}
            }
          ]
        };


        this.routeDto = routeDto;
      }
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
      items: this.orderItems
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
