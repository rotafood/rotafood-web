import { Status } from "../enums/status";
import { ContextModifierDto } from "./context-modifier";
import { ProductOptionDto } from "./product-option";

export interface OptionDto {
    id?: string;
    status: Status;
    index: number;
    contextModifiers: ContextModifierDto[];
    product: ProductOptionDto;
    fractions?: number[];
  }
  