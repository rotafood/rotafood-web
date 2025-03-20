import { Address } from "./address";
import { OrderDeliveryBy, OrderDeliveryMode } from "./order-enum";


export interface OrderDeliveryDto {
  id?: string;
  mode: OrderDeliveryMode;
  deliveryBy: OrderDeliveryBy;
  description?: string;
  pickupCode?: string;
  deliveryDateTime?: Date;
  address?: Address;
}
