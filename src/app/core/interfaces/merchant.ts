import { Address } from "./address";

export interface Merchant {
    id?: number | null;
    name: string;
    documentType: 'CPF' | 'CNPJ';
    document: string;
    
    address: Address;
  }



export interface User {
    email: string
    name: string
    phone: string
    password: string 
    
}


export interface MerchantUser {
  id?: number | null;
  email: string
  name: string
  phone: string
  merchant: Merchant
  
}


export interface CreateMerchant {
  accessToken: string
}