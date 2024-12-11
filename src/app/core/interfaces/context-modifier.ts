import { CatalogContext } from "../enums/catalog-context";
import { Status } from "../enums/status";
import { PriceDto } from "./price";

export interface ContextModifierDto {
    id: string;
    price: PriceDto | null;
    catalogContext: CatalogContext;
    status: Status;
  }
  