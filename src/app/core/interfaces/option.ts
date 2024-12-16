import { Status } from "../enums/status";
import { ContextModifierDto } from "./context-modifier";
import { ProductDto } from "./product";

export interface OptionDto {
    id: string;
    status: Status;
    index: number;
    contextModifiers: ContextModifierDto[];
    product: ProductDto | null;
  }
  