import { OrderItemDetailDto } from "./order-item-detail";
import { OrderItemOptionDto } from "./order-item-option";

export interface OrderItemDto {
  id: string;
  quantity: number;
  totalPrice: number;
  item: OrderItemDetailDto;
  options?: OrderItemOptionDto[];
}
