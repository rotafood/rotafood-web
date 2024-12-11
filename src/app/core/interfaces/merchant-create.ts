import { DocumentType } from "../enums/document-type";
import { MerchantType } from "../enums/merchant-type";
import { Address } from "./address";

export interface MerchantCreateDto {
    name: string;
    coorporativeName: string;
    description: string;
    documentType: DocumentType;
    merchantType: MerchantType;
    document: string;
    address: Address | null;
  }