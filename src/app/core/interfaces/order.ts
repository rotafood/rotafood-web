
import { OrderStatus } from "../enums/order-status";
import { OrderSalesChannel, OrderTiming, OrderType } from "./order-enum";
import { OrderTotalDto } from "./order-total";


export interface OrderDto {
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
}
