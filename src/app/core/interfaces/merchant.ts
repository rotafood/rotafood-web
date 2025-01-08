import { DocumentType } from "../enums/document-type";
import { MerchantType } from "../enums/merchant-type";
import { Address } from "./address";

export interface MerchantDto {
    id?: string | null;
    name: string;
    documentType: DocumentType;
    document: string;
    corporateName: string;
    onlineName: string;
    imagePath?: string;
    description?: string;
    merchantType: MerchantType;
    createdAt: Date;
    address: Address;

  }



