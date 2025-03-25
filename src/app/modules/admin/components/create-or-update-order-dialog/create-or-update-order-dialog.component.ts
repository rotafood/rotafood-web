import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FullOrderDto } from '../../../../core/interfaces/full-order';
import { FullCategoryDto } from '../../../../core/interfaces/category';
import { ItemDto } from '../../../../core/interfaces/item';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatalogContext } from '../../../../core/enums/catalog-context';
import { CategoriesService } from '../../../../core/services/cetegories/categories.service';
import { OrderService } from '../../../../core/services/orders.service';
import { AddOrderItemDialogComponent } from '../../../home/components/add-order-item-dialog/add-order-item-dialog.component';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { OrderType } from '../../../../core/interfaces/order-enum';
import { OrderItemDto } from '../../../../core/interfaces/order-item';
import { AddressDto } from '../../../../core/interfaces/address';
import { FullMerchantDto } from '../../../../core/interfaces/full-merchant';
import { CommandsService } from '../../../../core/services/commands.service';
import { CommandDto } from '../../../../core/interfaces/full-command-dto';
import { CommandCreateOrUpdateDialogComponent } from '../command-create-or-update-dialog/command-create-or-update-dialog.component';
import { PaymentMethodType } from '../../../../core/enums/payment-method-type';
import { PaymentType } from '../../../../core/enums/payment-type';

@Component({
  selector: 'app-create-or-update-order-dialog',
  templateUrl: './create-or-update-order-dialog.component.html',
  styleUrl: './create-or-update-order-dialog.component.scss'
})
export class CreateOrUpdateOrderDialogComponent implements OnInit {
  categories: FullCategoryDto[] = [];
  orderItems: OrderItemDto[] = [];
  commands: CommandDto[] = []
  isMobile = false
  orderForm = new FormGroup({
    type: new FormControl(this.data?.order?.type ?? null, Validators.required),
    status: new FormControl(this.data?.order?.status ?? 'CREATED', Validators.required),
    salesChannel: new FormControl(this.data?.order?.salesChannel ?? 'TABLE', Validators.required),
    timing: new FormControl(this.data?.order?.timing ?? 'IMMEDIATE', Validators.required),
    extraInfo: new FormControl(this.data?.order?.extraInfo ?? ''),
  });

  orderPayment = new FormGroup({
    id: new FormControl<string | undefined>(undefined),
    description: new FormControl('', [Validators.required]),
    pending: new FormControl(0),
    prepaid: new FormControl(0),
    methods: new FormArray([
      new FormGroup({
        method: new FormControl<PaymentMethodType | null>(null, Validators.required),
        type: new FormControl<PaymentType | null>(null, Validators.required),
        value: new FormControl<number>(0, [Validators.required, Validators.min(0.01)]),
        description: new FormControl('', Validators.required),
      })
    ])
  });
  



  deliveryForm = new FormGroup({
    id: new FormControl<string | undefined>(undefined),
    deliveryDateTime: new FormControl(new Date(), Validators.required),
    address: new FormControl<AddressDto | null>(null, Validators.required),
  });

  takeoutForm = new FormGroup({
    id: new FormControl<string | undefined>(undefined),
    takeoutDateTime: new FormControl<Date>(new Date(), Validators.required),
    comments: new FormControl('')
  });

  commandForm = new FormGroup({
    command: new FormControl<CommandDto | null>(null, [Validators.required])
  })

  customerForm = new FormGroup({
    id: new FormControl<string | undefined>(undefined),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { order: FullOrderDto | null, merchant: FullMerchantDto },
    private readonly categoriesService: CategoriesService,
    private readonly commandsService: CommandsService,
    private readonly dialogRef: MatDialogRef<CreateOrUpdateOrderDialogComponent>,
    private dialog: MatDialog,
    private readonly orderService: OrderService,
    private windowService: WindowWidthService,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);
    this.fetchCategories();
    this.fetchCommands()

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

  fetchCategories() {
    this.categoriesService.getAll().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: () => this.snackbar.open('Erro ao carregar categorias', 'Fechar', { duration: 3000 })
    });
  }

  fetchCommands() {
    this.commandsService.getAllCommandsSimplified().subscribe({
      next: (res) => {
        this.commands = res;
      },
      error: () => this.snackbar.open('Erro ao carregar commandas', 'Fechar', { duration: 3000 })
    });
  }

  addressFound(address: AddressDto) {
    this.deliveryForm.get("address")?.setValue(address)
  }

  addCommand() {
    this.dialog.open(CommandCreateOrUpdateDialogComponent, {
      width: '90%',
      height: '90%'
    }).afterClosed().subscribe(value => {
      if (value) {
        this.commands.push(value)
      }
    })
  }

  addOrderItem(item: ItemDto) {
    if (item) {
        this.dialog.open(AddOrderItemDialogComponent, {
            data: {item, context: this.getCatalogContext(), canAdd: true},
            width: this.isMobile ? "calc(100% - 30px)" : '50%',
            height: this.isMobile ? "calc(100% - 30px)" : '90%',
            maxWidth: "100%",
            maxHeight: "100%" 
          }).afterClosed().subscribe(
            orderItem => {
            if (orderItem) {
              this.orderItems.push(orderItem)
            }
          })
    }
  }

  getCatalogContext() {
    const orderType = this.orderForm.get("type")?.value
    if (orderType === OrderType.COMMAND) {
      return CatalogContext.TABLE
    }

    return CatalogContext.DELIVERY
  }

  onCancel() {
    this.dialogRef.close();
  }

  increaseQuantity(index: number) {
    this.orderItems[index].quantity = (this.orderItems[index].quantity ?? 1) + 1;
    this.updateItemTotalPrice(index);
  }

  decreaseQuantity(index: number) {
    if ((this.orderItems[index].quantity ?? 1) > 1) {
      this.orderItems[index].quantity = this.orderItems[index].quantity! - 1;
      this.updateItemTotalPrice(index);
    } else {
      this.removeItem(index);
    }
  }

  removeItem(index: number) {
    this.orderItems.splice(index, 1);
  }

  updateItemTotalPrice(index: number) {
    const item = this.orderItems[index];
    const unitPrice = item.totalPrice;
    item.totalPrice = unitPrice * (item.quantity ?? 1);
  }

  getTotal(): number {
    const itemsTotal = this.orderItems.reduce((acc, item) => acc + (item.totalPrice ?? 0), 0);
    const additionalFeesTotal = this.additionalFees?.reduce((acc, fee) => acc + fee.amount, 0) ?? 0;
    return itemsTotal + additionalFeesTotal + (this.freightValue ?? 0);
  }

  get additionalFees() {
    return this.data?.order?.additionalFees ?? [];
  }

  get freightValue() {
    return 0;
  }

  createPaymentMethodFormGroup(): FormGroup {
    return new FormGroup({
      method: new FormControl<PaymentMethodType | null>(null, Validators.required),
      type: new FormControl<PaymentType | null>(null, Validators.required),
      value: new FormControl<number>(0, [Validators.required, Validators.min(0.01)]),
      description: new FormControl('', Validators.required),
      prepaid: new FormControl(true),
      currency: new FormControl('BRL', Validators.required),
    });
  }
  
  get paymentMethodsArray(): FormArray {
    return this.orderPayment.get('methods') as FormArray;
  }
  
  addPaymentMethod() {
    this.paymentMethodsArray.push(this.createPaymentMethodFormGroup());
  }
  
  removePaymentMethod(index: number) {
    this.paymentMethodsArray.removeAt(index);
  }

  getItemPrice(item: ItemDto): number {
    const modifier = item.contextModifiers.find(mod => mod.catalogContext === this.getCatalogContext());
    return modifier ? modifier.price.value : 0;
  }


  onSubmit() {
    // if (this.orderForm.valid) {
    //   const order: FullOrderDto = {
    //     ...this.orderForm.value,
    //     preparationStartDateTime: new Date(),
    //     total: { orderAmount: 0, deliveryFee: 0, subTotal: 0, benefits: 0, additionalFees: 0 },
    //     items: this.orderItems.map(item => ({
    //       quantity: 1,
    //       totalPrice: this.getDeliveryPrice(item),
    //       catalogContext: CatalogContext.DELIVERY,
    //       item: {
    //         id: item.id,
    //         name: item.product.name,
    //         description: item.product.description,
    //         imagePath: item.product.imagePath,
    //         quantity: 1
    //       }
    //     })),
    //     payment: { prepaid: 0, pending: 0 },
    //   };

    //   this.orderService.createOrUpdateOrder(order).subscribe({
    //     next: (res) => {
    //       this.snackbar.open('Pedido criado com sucesso!', 'Fechar', { duration: 3000 });
    //       this.dialogRef.close(res);
    //     },
    //     error: (err) => {
    //       this.snackbar.open(err.error || 'Erro ao salvar pedido.', 'Fechar', { duration: 3000 });
    //     },
    //   });
    // }
  }
}
