import { CatalogContext } from "../../enums/catalog-context";
import { Serving } from "../../enums/serving";
import { ContextModifierDto } from "../catalog/context-modifier";
import { OrderItemDetailDto } from "./order-item-detail";
import { OrderItemOptionDto } from "./order-item-option";

export interface OrderItemDto {
  id?: string;
  quantity: number;
  serving?: Serving;
  totalPrice: number;
  contextModifierId: string;
  item: OrderItemDetailDto;
  options?: OrderItemOptionDto[];
}
