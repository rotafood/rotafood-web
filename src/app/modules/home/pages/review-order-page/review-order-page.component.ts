import { Component } from '@angular/core';
import { FullOrderDto } from '../../../../core/interfaces/full-order';
import { OrderItemDto } from '../../../../core/interfaces/order-item';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { ShowCatalogOnlineSideNavService } from '../../../../core/services/show-catalog-online-side-nav.service';
import { SharedOrderService } from '../../../../core/services/shared-order.service';
import { MerchantDto } from '../../../../core/interfaces/merchant';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../../../core/interfaces/address';
import { ActivatedRoute } from '@angular/router';
import { OrderDeliveryDtoBy, OrderDeliveryDtoDescription, OrderDeliveryDtoMode, OrderSalesChannel, OrderStatus, OrderTakeoutMode, OrderTiming, OrderType } from '../../../../core/interfaces/order-enum';
import { PaymentMethodType } from '../../../../core/enums/payment-method-type';
import { PaymentType } from '../../../../core/enums/payment-type';
import { OrderDeliveryDto } from '../../../../core/interfaces/order-delivery';
import { CatalogOnlineService } from '../../../../core/services/catalog-online.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-review-order-page',
  templateUrl: './review-order-page.component.html',
  styleUrl: './review-order-page.component.scss'
})
export class ReviewOrderPageComponent {

  merchant: MerchantDto | undefined = undefined;
  order: FullOrderDto | undefined = undefined;
  orderItems: OrderItemDto[] = [];
  totalPrice = 0;
  public routeCatlogContext: string | undefined = undefined;
  public showNav = false;
  public isMobile = false;

  orderForm = new FormGroup({
    deliveryType: new FormControl<string | null>(null, Validators.required), 
    address: new FormControl<Address | null>(null), 
    name: new FormControl<string>('', Validators.required),
    phone: new FormControl<string>('', [Validators.required]),
    paymentMethod: new FormControl<string | null>(null, Validators.required)
  });

  constructor(
    public windowService: WindowWidthService,
    public sideNavService: ShowCatalogOnlineSideNavService,
    private route: ActivatedRoute,
    private catalogOnlineService: CatalogOnlineService,
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
    private sharedOrderService: SharedOrderService
  ) {}

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
      },
      error: (errors) => {
        this.snackbar.open('Resurante não encontrado :(', 'fechar');
      }
    });
  }

  formatPhone(value: string): void {
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

  private calculateTotal() {
    this.totalPrice = this.orderItems.reduce((total, item) => total + item.totalPrice, 0);
  }
  

  submitOrder() {
    if (this.orderForm.invalid) {
      return;
    }
  
    const isDelivery = this.orderForm.value.deliveryType === 'entrega';
    const orderType = isDelivery ? OrderType.DELIVERY : OrderType.TAKEOUT;

    const deliveryFee = isDelivery ? 5.0 : 0; 
    const subTotal = this.orderItems.reduce((total, item) => total + item.totalPrice, 0);
    const benefits = 0;
    const additionalFees = 0;
    const orderAmount = subTotal + deliveryFee + additionalFees - benefits;

    const deliveryDto: OrderDeliveryDto | undefined = isDelivery
    ? {
        mode: OrderDeliveryDtoMode.STANDARD,
        deliveryBy: OrderDeliveryDtoBy.MERCHANT, 
        description: OrderDeliveryDtoDescription.HOME_DELIVERY,
        deliveryDateTime: new Date(),
        address: this.orderForm.value.address!,
      }
    : undefined;
  
    const orderDto: FullOrderDto = {
      id: undefined,
      type: orderType,
      status: OrderStatus.CREATED,
      salesChannel: OrderSalesChannel.ROTAFOOD,
      preparationStartDateTime: new Date(),
      timing: OrderTiming.IMMEDIATE,
      merchantId: this.merchant?.id,
      extraInfo: '', 
      total: {
        benefits: benefits,
        deliveryFee: deliveryFee,
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
      takeout: isDelivery ? undefined : {
        takeoutDateTime: new Date(),
        mode: OrderTakeoutMode.DEFAULT,
        comments: ''
      },
      payment: {
        id: undefined,
        description: `Pagamento via ${this.orderForm.value.paymentMethod}`,
        methods: [
          {
            description: this.orderForm.value.paymentMethod!,
            method: PaymentMethodType.CASH,
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
        this.openWhatsApp(response)
      },
      error: (error) => {
        this.snackbar.open(`Erro ${error.error.status} - ${error.error.details}`, "Fechar", {duration: 3000})
      }
    })
  
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
      🛒 *Novo Pedido* 🛒
      
      📌 *Cliente:* ${customerName} (${customerPhone})
      📦 *Tipo:* ${deliveryType}
      ${isDelivery ? `🏠 *${address}*` : ""}
      
      🍽️ *Itens do Pedido:*
      ${itemsList}
  
      💰 *Total:* R$ ${totalAmount}
      💳 *Forma de Pagamento:* ${paymentMethod}
  
      🔔 *Aguardando confirmação pelo app do rotafood!*
    `);
  
    const whatsappUrl = `https://wa.me/55${this.merchant?.phone.replace(/\D/g, '')}?text=${message}`;
  
    window.open(whatsappUrl, "_blank");
  }
  
}
