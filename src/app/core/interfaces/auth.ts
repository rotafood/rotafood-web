import { Merchant } from "./merchant"
import { MerchantCreate } from "./merchant-create"
import { OwnerCreate } from "./owner-create"

export interface AuthToken {
    accessToken: string
  }
  export interface User {
    email: string
    name: string
    phone: string
    password: string 
    
}
export interface MerchantOwnerCreation {
    merchant: MerchantCreate
    owner: OwnerCreate
}

export interface Login {
    email: string
    password: string
}