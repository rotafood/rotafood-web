import { MerchantUser } from "./merchant/merchant-user";

export interface TokenMerchantUser{
    subject: string;
    exp: number;
    merchantUser: MerchantUser
}