import { Address } from "./address";

export interface Merchant {
    id?: number | null;
    name: string;
    documentType: 'CPF' | 'CNPJ';
    document: string;
    
    address: Address;
  }

export enum ModulePermission{
  MERCHANT = 'MERCHANT',
  INTEGRATION = 'INTEGRATION',
  PRODUCTS = 'PRODUCTS',
  ORDERS = 'ORDERS',
  COMMANDS = 'COMMANDS',
  ROUTES = 'ROUTES',
  DRIVERS = 'DRIVERS',
  CATALOGS = 'CATALOGS'
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
  permissions: ModulePermission[]
  merchant: Merchant
  
}


export interface Token {
  accessToken: string
}