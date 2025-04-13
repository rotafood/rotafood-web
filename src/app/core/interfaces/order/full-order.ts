import { CustomerDto } from "../customer";
import { CommandDto } from "../full-command-dto";
import { OrderAdditionalFeeDto } from "./order-additional-fee";
import { OrderBenefitDto } from "./order-benefit";
import { OrderDeliveryDto } from "./order-delivery";
import { OrderSalesChannel, OrderStatus, OrderTiming, OrderType } from "./order-enum";
import { OrderItemDto } from "./order-item";
import { PaymentRecordDto } from "./order-payment";
import { OrderScheduleDto } from "./order-schedule";
import { OrderTakeoutDto } from "./order-takeout";
import { OrderTotalDto } from "./order-total";


export interface FullOrderDto {
  id?: string;
  merchantSequence?: number;
  modifiedAt?: Date;
  createdAt?: Date;
  preparationStartDateTime: Date;
  type: OrderType;
  status: OrderStatus;
  salesChannel: OrderSalesChannel;
  timing: OrderTiming;
  extraInfo?: string;
  merchantId?: string;
  total: OrderTotalDto;
  customer?: CustomerDto; 
  delivery?: OrderDeliveryDto;
  schedule?: OrderScheduleDto;
  takeout?: OrderTakeoutDto;
  command?: CommandDto
  payment: PaymentRecordDto;
  items: OrderItemDto[];
  benefits?: OrderBenefitDto[];
  additionalFees?: OrderAdditionalFeeDto[];
}
