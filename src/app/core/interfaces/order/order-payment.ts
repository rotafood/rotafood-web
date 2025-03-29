import { OrderPaymentMethodDto } from "./order-payment-method";

export interface OrderPaymentDto {
  id?: string;
  description: string;
  methods: OrderPaymentMethodDto[];
  pending: number;
  prepaid: number;
}
