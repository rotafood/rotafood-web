import { CatalogContext } from "../../enums/catalog-context";
import { Serving } from "../../enums/serving";
import { OrderItemDetailDto } from "./order-item-detail";
import { OrderItemOptionDto } from "./order-item-option";

export interface OrderItemDto {
  id?: string;
  quantity: number;
  serving?: Serving | string;
  totalPrice: number;
  catalogContext:CatalogContext
  item: OrderItemDetailDto;
  options?: OrderItemOptionDto[];
}
