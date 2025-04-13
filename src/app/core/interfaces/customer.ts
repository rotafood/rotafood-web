import { AddressDto } from "./address";

export interface FullCustomerDto {
    id?: string,
    name: string,
    phone: string,
    addresses: AddressDto[]
}

export interface CustomerDto {
    id?: string,
    name: string,
    phone: string
}