import { PackagingType } from "../enums/packagiong-type";
import { ProductOptionGroupDto } from "./product-option-group";
import { ProductPackagingDto } from "./product-packaging";
import { WeightDto } from "./weight";

export interface ProductDto {
    id: string;
    name: string;
    description: string;
    ean?: string;
    additionalInformation?: string;
    dietaryRestrictions?: string[];
    itemId?: string | null;
    optionId?: string | null;
    weight?: WeightDto | null;
    packagings?: ProductPackagingDto[];
    productOptionGroups?: ProductOptionGroupDto[];
    serving?: string;
    tags?: string[];
    imagePath?: string;
    packagingType?: PackagingType;
  }
  