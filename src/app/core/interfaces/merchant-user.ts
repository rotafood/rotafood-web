import { MerchantUserRole } from "../enums/merchant-user-role";
import { MerchantDto } from "./merchant";




export interface MerchantUser {
  id?: string | null;
  name: string;
  email: string;
  phone: string;
  role: MerchantUserRole
  merchant: MerchantDto

}