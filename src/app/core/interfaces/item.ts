import { Status } from "../enums/status";
import { TempletaType } from "../enums/template-type";
import { ContextModifierDto } from "./context-modifier";
import { ProductDto } from "./product";
import { ShiftDto } from "./shift";

export interface ItemDto {
    id?: string;
    status: Status;
    index: number;
    type: TempletaType;
    categoryId: string;
    shifts: ShiftDto[];
    contextModifiers: ContextModifierDto[];
    product: ProductDto;
  }
  