import { MerchantPermission } from "../enums/merchant-user";
import { MerchantDto } from "./merchant";




export interface MerchantUser {
  id?: string | null;
  name: string;
  email: string;
  phone: string;
  merchantPermissions: MerchantPermission[]
  merchant: MerchantDto

}