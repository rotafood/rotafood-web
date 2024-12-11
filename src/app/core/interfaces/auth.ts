import { MerchantCreateDto } from "./merchant-create"
import { OwnerCreateDto } from "./owner-create"

export interface AuthTokenDto {
    accessToken: string
  }
export interface MerchantOwnerCreationDto {
    merchant: MerchantCreateDto
    owner: OwnerCreateDto
}

export interface LoginDto {
    email: string
    password: string
} 