import { CatalogContext } from "../../enums/catalog-context";
import { OrderOptionDetailDto } from "./order-option-detail";

export interface OrderItemOptionDto {
  id?: string;
  quantity: number;
  totalPrice: number;
  catalogContext: CatalogContext;
  groupName: string;
  groupId: string;
  option: OrderOptionDetailDto;
}
