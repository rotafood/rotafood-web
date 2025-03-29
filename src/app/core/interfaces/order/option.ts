import { Status } from "../../enums/status";
import { ContextModifierDto } from "../catalog/context-modifier";
import { ProductOptionDto } from "../catalog/product-option";

export interface OptionDto {
    id?: string;
    status: Status;
    index: number;
    contextModifiers: ContextModifierDto[];
    product: ProductOptionDto;
    fractions?: number[];
  }
  