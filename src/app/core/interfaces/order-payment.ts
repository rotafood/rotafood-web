import { OrderPaymentDtoMethod } from "./order-payment-method";

export interface OrderPaymentDto {
  id: string;
  description: string;
  methods: OrderPaymentDtoMethod[];
  pending: number;
  prepaid: number;
}
