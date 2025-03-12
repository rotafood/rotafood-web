import { DocumentType } from "../enums/document-type";
import { MerchantType } from "../enums/merchant-type";
import { Address } from "./address";
import { ShiftDto } from "./shift";

export interface MerchantDto {
    id?: string;
    name: string;
    documentType: DocumentType;
    document: string;
    corporateName: string;
    onlineName: string;
    imagePath?: string;
    phone: string;
    description?: string;
    merchantType: MerchantType;
    createdAt: Date;
    lastOpenedUtc: Date;
    address: Address;
    openingHours: ShiftDto[]

  }



