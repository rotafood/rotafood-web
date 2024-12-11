import { Address } from "./address";

export interface MerchantDto {
    id?: string | null;
    name: string;
    documentType: DocumentType;
    document: string;
    
    address: Address;
  }



