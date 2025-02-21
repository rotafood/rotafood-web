import { CategoryDto, GetCategoryDto } from "./category";
import { MerchantDto } from "./merchant";

export interface MerchantAndCategoriesDto{
    merchant: MerchantDto,
    categories: GetCategoryDto[]
}