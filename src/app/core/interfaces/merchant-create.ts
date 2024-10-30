import { Address } from "./address";

export interface MerchantCreate {
    name: string;
    coorporativeName: string;
    description: string;
    documentType: 'CPF' | 'CNPJ';
    document: string;
    address: Address | null;
  }