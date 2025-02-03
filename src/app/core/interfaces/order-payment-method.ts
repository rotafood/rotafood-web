import { PaymentMethodType } from "../enums/payment-method-type";
import { PaymentType } from "../enums/payment-type";
import { OrderCashInformation } from "./order-cash-information";
import { OrderCreditCardInformation } from "./order-credit-card-information";
import { OrderDigitalWalletInformation } from "./order-digital-wallet-information";
import { OrderTransactionInformation } from "./order-transaction-information";

export interface OrderPaymentDtoMethod {
    id: string;
    description: string;
    method: PaymentMethodType;
    prepaid: boolean;
    currency: string;
    type: PaymentType;
    value: number;
    wallet?: OrderDigitalWalletInformation;
    cash?: OrderCashInformation;
    card?: OrderCreditCardInformation;
    transaction?: OrderTransactionInformation;
  }
