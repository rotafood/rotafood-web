import { Status } from "../enums/status";
import { ContextModifierDto } from "./context-modifier";
import { ItemOptionGroupDto } from "./item-option-group";
import { OptionGroupDto } from "./option-group";
import { PriceDto } from "./price";
import { ProductDto } from "./product";
import { ShiftDto } from "./shift";

export interface ItemDto {
    id: string;
    status: Status;
    index: number;
    price: PriceDto;
    categoryId: string;
    shifts: ShiftDto[];
    contextModifiers: ContextModifierDto[];
    product: ProductDto;
    itemOptionGroups: ItemOptionGroupDto[];
  }
  