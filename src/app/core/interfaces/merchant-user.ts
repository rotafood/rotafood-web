import { Merchant } from "./merchant";

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
  
  
  export interface MerchantUser {
    id?: number | null;
    email: string
    name: string
    phone: string 
    permissions: ModulePermission[]
    merchant: Merchant
    
  }