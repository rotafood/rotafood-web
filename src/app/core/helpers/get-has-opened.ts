import { FullMerchantDto } from "../interfaces/merchant/full-merchant";

export function getHasOpened(merchant?: FullMerchantDto): boolean {
    if (!merchant || merchant?.lastOpenedUtc) {
      return false;
    }
  
    const lastOpened = new Date(merchant?.lastOpenedUtc).getTime();
    const nowUtc = new Date().getTime(); 
  
    return (nowUtc - lastOpened) < 30000;
  }