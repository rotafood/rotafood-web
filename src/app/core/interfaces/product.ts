import { ProductPackagingDto } from "./product-packaging";
import { SellingOptionDto } from "./selling-option";
import { WeightDto } from "./weight";

export interface ProductDto {
    id: string;
    name: string;
    description: string;
    ean: string;
    additionalInformation: string;
    dietaryRestrictions: string[];
    sellingOption: SellingOptionDto | null;
    itemId: string | null;
    optionId: string | null;
    weight: WeightDto | null;
    packagings: ProductPackagingDto[];
    serving: string;
    tags: string[];
    imagePath: string;
    multipleImages: string[];
  }
  