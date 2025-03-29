import { PaymentMethodType } from "../../enums/payment-method-type";
import { PaymentType } from "../../enums/payment-type";

export interface OrderPaymentMethodDto {
    id?: string;
    description: string;
    method: PaymentMethodType;
    prepaid: boolean;
    type: PaymentType;
    value: number;
    changeFor?: number;
  }
