import { OrderIndoorDtoMode } from "./order-enum";


export interface OrderIndoorDto {
  id?: string;
  mode: OrderIndoorDtoMode;
  deliveryDateTime?: Date;
}
