import { PaymentMethodType } from "../enums/payment-method-type";
import { PaymentType } from "../enums/payment-type";

export interface OrderPaymentDtoMethod {
    id?: string;
    description: string;
    method: PaymentMethodType;
    prepaid: boolean;
    currency: string;
    type: PaymentType;
    value: number;
  }
