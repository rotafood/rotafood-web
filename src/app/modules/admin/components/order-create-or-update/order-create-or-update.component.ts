import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FullOrderDto } from '../../../../core/interfaces/order/full-order';
import { FullCategoryDto } from '../../../../core/interfaces/catalog/category';
import { OrderItemDto } from '../../../../core/interfaces/order/order-item';
import { ItemDto } from '../../../../core/interfaces/catalog/item';
import { CommandDto } from '../../../../core/interfaces/full-command-dto';
import { FullMerchantDto } from '../../../../core/interfaces/merchant/full-merchant';
import { AddressDto } from '../../../../core/interfaces/address';
import { OrderPaymentDto } from '../../../../core/interfaces/order/order-payment';

import { OrderType, OrderStatus, OrderSalesChannel, OrderTiming, OrderDeliveryBy, OrderDeliveryMode } from '../../../../core/interfaces/order/order-enum';
import { PaymentMethodType } from '../../../../core/enums/payment-method-type';
import { PaymentType } from '../../../../core/enums/payment-type';
import { CatalogContext } from '../../../../core/enums/catalog-context';

import { CategoriesService } from '../../../../core/services/cetegories/categories.service';
import { OrderService } from '../../../../core/services/orders.service';
import { CommandsService } from '../../../../core/services/commands.service';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';

import { AddOrderItemDialogComponent } from '../../../home/components/add-order-item-dialog/add-order-item-dialog.component';
import { CommandCreateOrUpdateDialogComponent } from '../command-create-or-update-dialog/command-create-or-update-dialog.component';

import { formatPhone } from '../../../../core/helpers/format-phone';
import { numberToString, stringToNumber } from '../../../../core/helpers/string-number-parser';
import { changeForOptions } from '../../../../core/mocks/change-for-options';
import { RouteDto } from '../../../../core/interfaces/catalog/distance-out';
import { MerchantService } from '../../../../core/services/merchant/merchant.service';
import { OrderCustomerDto } from '../../../../core/interfaces/order/order-customer';
import { OrderPaymentMethodDto } from '../../../../core/interfaces/order/order-payment-method';
import { OrderDeliveryDto } from '../../../../core/interfaces/order/order-delivery';
import { OrderTakeoutDto } from '../../../../core/interfaces/order/order-takeout';
import { OrderScheduleDto } from '../../../../core/interfaces/order/order-schedule';

@Component({
  selector: 'app-order-create-or-update',
  templateUrl: './order-create-or-update.component.html',
  styleUrl: './order-create-or-update.component.scss'
})
export class OrderCreateOrUpdateComponent {
  categories: FullCategoryDto[] = [];
  orderItems: OrderItemDto[] = [];
  commands: CommandDto[] = [];
  changeForOptions = changeForOptions;
  isMobile = false;
  routeDto: RouteDto | null = null;

  orderForm = new FormGroup({
    id: new FormControl(this.data?.order?.id),
    type: new FormControl(this.data?.order?.type ?? OrderType.COMMAND, Validators.required),
    status: new FormControl(this.data?.order?.status ?? 'CREATED', Validators.required),
    salesChannel: new FormControl(this.data?.order?.salesChannel ?? OrderSalesChannel.CALL, Validators.required),
    timing: new FormControl(this.data?.order?.timing ?? 'IMMEDIATE', Validators.required),
    extraInfo: new FormControl(this.data?.order?.extraInfo ?? '')
  });

  customerForm = new FormGroup({
    id: new FormControl<string | undefined>(undefined),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  deliveryForm = new FormGroup({
    id: new FormControl<string | undefined>(undefined),
    deliveryDateTime: new FormControl(new Date(), Validators.required),
    deliveryBy: new FormControl(OrderDeliveryBy.MERCHANT),
    mode: new FormControl(OrderDeliveryMode.DEFAULT),
    address: new FormControl<AddressDto | null>(null, Validators.required)
  });

  takeoutForm = new FormGroup({
    id: new FormControl<string | undefined>(undefined),
    takeoutDateTime: new FormControl<Date>(new Date(), Validators.required),
    comments: new FormControl('')
  });

  commandForm = new FormGroup({
    command: new FormControl<CommandDto | null>(null, [Validators.required])
  });

  orderTotalForm = new FormGroup({
    orderAmount: new FormControl(0),
    deliveryFee: new FormControl(0),
    subTotal: new FormControl(0),
    benefits: new FormControl(0),
    additionalFees: new FormControl(0)
  });

  orderPayment = new FormGroup({
    id: new FormControl<string | undefined>(undefined),
    description: new FormControl('', [Validators.required]),
    pending: new FormControl(0),
    prepaid: new FormControl(0),
    methods: new FormArray([])
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { order: FullOrderDto | null; merchant: FullMerchantDto },
    private categoriesService: CategoriesService,
    private commandsService: CommandsService,
    private orderService: OrderService,
    private dialogRef: MatDialogRef<OrderCreateOrUpdateComponent>,
    private dialog: MatDialog,
    private merchantService: MerchantService,
    private windowService: WindowWidthService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.windowService.isMobile().subscribe((isMobile) => (this.isMobile = isMobile));
    this.fetchCategories();
    this.fetchCommands();
    this.setDefaultDeliveryDates();
    this.addPaymentMethod();
  }

  initializeForms(): void {
    const order = this.data.order;

    this.orderForm.patchValue({
      id: order?.id,
      type: order?.type ?? this.orderForm.get('type')?.value,
      status: order?.status ?? this.orderForm.get('status')?.value,
      salesChannel: order?.salesChannel ?? this.orderForm.get('salesChannel')?.value,
      timing: order?.timing ?? this.orderForm.get('timing')?.value,
      extraInfo: order?.extraInfo ?? this.orderForm.get('extraInfo')?.value
    });

    if (order?.customer) {
      this.customerForm.patchValue({
        id: order.customer.id ?? undefined,
        name: order.customer.name ?? '',
        phone: order.customer.phone ?? ''
      });
    }

    if (order?.delivery) {
      this.deliveryForm.patchValue({
        id: order.delivery.id ?? undefined,
        deliveryDateTime: order.delivery.deliveryDateTime
          ? new Date(order.delivery.deliveryDateTime)
          : new Date(),
        address: order.delivery.address ?? null,
        deliveryBy: order.delivery.deliveryBy ?? OrderDeliveryBy.MERCHANT,
        mode: order.delivery.mode ?? OrderDeliveryMode.DEFAULT,
      });
    }

    if (order?.takeout) {
      this.takeoutForm.patchValue({
        id: order.takeout.id ?? undefined,
        takeoutDateTime: order.takeout.takeoutDateTime
          ? new Date(order.takeout.takeoutDateTime)
          : new Date(),
        comments: order.takeout.comments ?? ''
      });
    }

    if (order?.command) {
      this.commandForm.patchValue({
        command: order.command ?? null
      });
    }

    if (order?.items) {
      this.orderItems = order.items;
    }

    if (order?.total) {
      this.orderTotalForm.patchValue({
        orderAmount: order.total.orderAmount ?? 0,
        deliveryFee: order.total.deliveryFee ?? 0,
        subTotal: order.total.subTotal ?? 0,
        benefits: order.total.benefits ?? 0,
        additionalFees: order.total.additionalFees ?? 0
      });
    }

    if (order?.payment) {
      this.orderPayment.patchValue({
        id: order.payment.id ?? undefined,
        description: order.payment.description ?? '',
        pending: order.payment.pending ?? 0,
        prepaid: order.payment.prepaid ?? 0
      });

      this.paymentMethodsArray.clear();
      order.payment.methods?.forEach((method) => {
        const pmForm = this.createPaymentMethodFormGroup(method);
        this.paymentMethodsArray.push(pmForm);
      });
    }

    this.updateOrderTotals();
  }

  private fetchCategories() {
    this.categoriesService.getAll().subscribe({
      next: (res) => (this.categories = res),
      error: () =>
        this.snackbar.open('Erro ao carregar categorias', 'Fechar', {
          duration: 3000
        })
    });
  }

  private fetchCommands() {
    this.commandsService.getAllCommandsSimplified().subscribe({
      next: (res) => (this.commands = res),
      error: () =>
        this.snackbar.open('Erro ao carregar comandas', 'Fechar', {
          duration: 3000
        })
    });
  }

  private setDefaultDeliveryDates() {
    const now = new Date();
    const deliveryMaxMinutes = this.data.merchant.orderEstimate?.deliveryMaxMinutes ?? 30;
    const pickupMaxMinutes = this.data.merchant.orderEstimate?.pickupMaxMinutes ?? 15;

    this.deliveryForm.patchValue({
      deliveryDateTime: new Date(now.getTime() + deliveryMaxMinutes * 60000)
    });

    this.takeoutForm.patchValue({
      takeoutDateTime: new Date(now.getTime() + pickupMaxMinutes * 60000)
    });
  }

  onPhoneInputChange(value: string) {
    const formatted = formatPhone(value);
    if (this.customerForm.controls.phone.value !== formatted) {
      this.customerForm.controls.phone.setValue(formatted, { emitEvent: false });
    }
  }

  getItemPrice(item: ItemDto): number {
    const modifier = item.contextModifiers.find(mod => mod.catalogContext === this.getCatalogContext());
    return modifier ? modifier.price.value : 0;
  }

  addressFound(address: AddressDto) {
    this.deliveryForm.get('address')?.setValue(address);
    this.updateOrderTotals();
  }

  getRoute() {
    const address = this.deliveryForm.get('address')?.value;
    if (address) {
      this.merchantService.getRoute(address).subscribe({
        next: (response) => {
          this.routeDto = response;
          // set new deliveryFee in form
          const fee = response.deliveryFee ?? 0;
          this.orderTotalForm.patchValue({ deliveryFee: fee });
          this.updateOrderTotals();
        },
        error: (err) => {
          this.snackbar.open(
            err.error || 'Erro ao calcular o frete.',
            'Fechar',
            {
              duration: 3000
            }
          );
        }
      });
    }
  }

  addCommand() {
    this.dialog.open(CommandCreateOrUpdateDialogComponent, {
      width: '90%',
      height: '90%'
    }).afterClosed().subscribe((value) => {
      if (value) {
        this.commands.push(value);
      }
    });
  }

  addOrderItem(item: ItemDto) {
    this.dialog
      .open(AddOrderItemDialogComponent, {
        data: {
          item,
          context: this.getCatalogContext(),
          canAdd: true
        },
        width: this.isMobile ? 'calc(100% - 30px)' : '50%',
        height: this.isMobile ? 'calc(100% - 30px)' : '90%',
        maxWidth: '100%',
        maxHeight: '100%'
      })
      .afterClosed()
      .subscribe((orderItem?: OrderItemDto) => {
        if (orderItem) {
          this.orderItems.push(orderItem);
          this.updateOrderTotals();
        }
      });
  }

  private getCatalogContext() {
    return this.orderForm.get('type')?.value === OrderType.COMMAND
      ? CatalogContext.TABLE
      : CatalogContext.DELIVERY;
  }

  increaseQuantity(index: number) {
    this.orderItems[index].quantity = (this.orderItems[index].quantity ?? 1) + 1;
    this.updateItemTotalPrice(index);
  }

  decreaseQuantity(index: number) {
    if ((this.orderItems[index].quantity ?? 1) > 1) {
      this.orderItems[index].quantity!--;
      this.updateItemTotalPrice(index);
    } else {
      this.removeItem(index);
    }
  }

  removeItem(index: number) {
    this.orderItems.splice(index, 1);
    this.updateOrderTotals();
  }

  private updateItemTotalPrice(index: number) {
    const item = this.orderItems[index];
    item.totalPrice = (item.totalPrice ?? 0) * (item.quantity ?? 1);
    this.updateOrderTotals();
  }

  private updateOrderTotals(): void {
    const subTotal = this.orderItems.reduce((acc, item) => acc + (item.totalPrice ?? 0), 0);
    const additionalFees = this.orderTotalForm.get('additionalFees')?.value ?? 0;
    const benefits = this.orderTotalForm.get('benefits')?.value ?? 0;
    const deliveryFee = this.orderTotalForm.get('deliveryFee')?.value ?? 0;
    const orderAmount = subTotal + additionalFees + deliveryFee + benefits;
    this.orderTotalForm.patchValue(
      {
        subTotal,
        additionalFees,
        benefits,
        deliveryFee,
        orderAmount
      },
      { emitEvent: false }
    );

    this.updatePaymentSplits();
  }

  private createPaymentMethodFormGroup(method?: OrderPaymentMethodDto): FormGroup {
    return new FormGroup({
      method: new FormControl<PaymentMethodType>(
        method?.method ?? PaymentMethodType.CREDIT,
        Validators.required
      ),
      type: new FormControl<PaymentType>(method?.type ?? PaymentType.OFFLINE, Validators.required),
      value: new FormControl<string>(
        method?.value ? numberToString(method.value) : '0,00',
        [Validators.required]
      ),
      description: new FormControl(method?.description ?? '', Validators.required),
      prepaid: new FormControl(method?.prepaid ?? true),
      changeFor: new FormControl(method?.changeFor ?? null)
    });
  }

  get paymentMethodsArray(): FormArray {
    return this.orderPayment.get('methods') as FormArray;
  }

  addPaymentMethod() {
    this.paymentMethodsArray.push(this.createPaymentMethodFormGroup());
    this.updatePaymentSplits();
  }

  removePaymentMethod(index: number) {
    this.paymentMethodsArray.removeAt(index);
    this.updatePaymentSplits();
  }

  private updatePaymentSplits(): void {
    const orderAmount = this.orderTotalForm.get('orderAmount')?.value ?? 0;
    const methodsCount = this.paymentMethodsArray.length;
    if (methodsCount === 0 || orderAmount <= 0) {
      return;
    }

    const share = orderAmount / methodsCount;
    this.paymentMethodsArray.controls.forEach((ctrl) => {
      ctrl.get('value')?.setValue(numberToString(share), { emitEvent: false });
    });
  }

  onSubmit(): void {
    if (!this.orderForm.valid) {
      return;
    }

    this.updatePaymentSplits();

    const totals = this.orderTotalForm.value;

    const formattedPayment = {
      ...this.orderPayment.value,
      methods: this.paymentMethodsArray.controls.map((control) => ({
        id: control.get('id')?.value!,
        method: control.get('method')?.value!,
        type: control.get('type')?.value!,
        value:
          stringToNumber(control.get('value')?.value),
        description: control.get('description')?.value!,
        prepaid: control.get('prepaid')?.value!,
        changeFor: control.get('changeFor')?.value
      }))
    };

    let customer = this.customerForm.value;
    if (
      this.orderForm.value.type === OrderType.COMMAND &&
      this.commandForm.value.command
    ) {
      customer = {
        name: this.commandForm.value.command.name
      };
    }

    const finalOrder: FullOrderDto = {
      ...this.data.order,
      merchantId: this.data.merchant.id,
      type: this.orderForm.value.type as OrderType,
      status: this.orderForm.value.status as OrderStatus,
      salesChannel: this.orderForm.value.salesChannel as OrderSalesChannel,
      timing: this.orderForm.value.timing as OrderTiming,
      preparationStartDateTime: new Date(),
      total: {
        orderAmount: totals.orderAmount ?? 0,
        deliveryFee: totals.deliveryFee ?? 0,
        subTotal: totals.subTotal ?? 0,
        benefits: totals.benefits ?? 0,
        additionalFees: totals.additionalFees ?? 0
      },
      customer: customer as OrderCustomerDto,
      items: this.orderItems,
      payment: formattedPayment as OrderPaymentDto
    };

    if (this.orderForm.value.type === 'DELIVERY') {
      finalOrder.delivery = { ...this.deliveryForm.value } as OrderDeliveryDto;
      finalOrder.takeout = undefined;
      finalOrder.command = undefined;
      finalOrder.schedule = undefined;
    }
    else if (this.orderForm.value.type === 'TAKEOUT') {
      finalOrder.takeout = { ...this.takeoutForm.value } as OrderTakeoutDto;
      finalOrder.delivery = undefined;
      finalOrder.command = undefined;
      finalOrder.schedule = undefined;
    }
    else if (this.orderForm.value.type === 'COMMAND') {
      finalOrder.command = { ...this.commandForm.value.command } as CommandDto;
      finalOrder.delivery = undefined;
      finalOrder.takeout = undefined;
      finalOrder.schedule = undefined;
    }

    this.orderService.createOrUpdateOrder(finalOrder).subscribe({
      next: (res) => {
        this.snackbar.open('Pedido criado com sucesso!', 'Fechar', {
          duration: 3000
        });
        this.dialogRef.close(res);
      },
      error: (err) => {
        console.log(err);
        this.snackbar.open(
          err.error?.errors || err.error?.details || 'Erro ao salvar pedido.',
          'Fechar',
          {
            duration: 3000
          }
        );
      }
    });
  }
}
