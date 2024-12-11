import { Status } from "../enums/status";
import { PriceDto } from "./price";
import { ProductDto } from "./product";

export interface OptionDto {
    id: string;
    status: Status;
    index: number;
    price: PriceDto;
    product: ProductDto | null;
  }
  