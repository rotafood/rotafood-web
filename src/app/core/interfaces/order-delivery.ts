import { Address } from "./address";
import { OrderDeliveryDtoBy, OrderDeliveryDtoDescription, OrderDeliveryDtoMode } from "./order-enum";


export interface OrderDeliveryDto {
  id?: string;
  mode: OrderDeliveryDtoMode;
  deliveryBy: OrderDeliveryDtoBy;
  description: OrderDeliveryDtoDescription;
  pickupCode?: string;
  deliveryDateTime?: Date;
  address?: Address;
}
