import { CatalogContext } from "../enums/catalog-context";
import { Status } from "../enums/status";

export interface CatalogDto {
    id?: string;
    catalogContext: CatalogContext;
    status: Status;
    modifiedAt: Date
  }