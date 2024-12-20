import { Status } from "../enums/status";
import { ContextModifierDto } from "./context-modifier";
import { ProductDto } from "./product";
import { ProductOptionDto } from "./product-option";

export interface OptionDto {
    id?: string;
    status: Status;
    index: number;
    contextModifiers: ContextModifierDto[];
    product: ProductOptionDto;
    fractions?: number[];
  }
  