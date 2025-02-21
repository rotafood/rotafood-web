import { OrderAdditionalFeeDto } from "./order-additional-fee";
import { OrderBenefitDto } from "./order-benefit";
import { OrderCustomerDto } from "./order-customer";
import { OrderDeliveryDto } from "./order-delivery";
import { OrderSalesChannel, OrderStatus, OrderTiming, OrderType } from "./order-enum";
import { OrderIndoorDto } from "./order-indoor";
import { OrderItemDto } from "./order-item";
import { OrderPaymentDto } from "./order-payment";
import { OrderScheduleDto } from "./order-schedule";
import { OrderTakeoutDto } from "./order-takeout";
import { OrderTotalDto } from "./order-total";


export interface FullOrderDto {
  id?: string;
  modifiedAt: Date;
  createdAt: Date;
  type: OrderType;
  status: OrderStatus;
  preparationStartDateTime?: Date;
  salesChannel: OrderSalesChannel;
  timing: OrderTiming;
  extraInfo?: string;
  merchantId: string;
  total: OrderTotalDto;
  customer?: OrderCustomerDto;
  delivery?: OrderDeliveryDto;
  schedule?: OrderScheduleDto;
  indoor?: OrderIndoorDto;
  takeout?: OrderTakeoutDto;
  payment?: OrderPaymentDto;
  items: OrderItemDto[];
  benefits?: OrderBenefitDto[];
  additionalFees?: OrderAdditionalFeeDto[];
}
