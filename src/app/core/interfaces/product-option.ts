import { PackagingType } from "../enums/packagiong-type";
import { ProductOptionGroupDto } from "./product-option-group";
import { ProductPackagingDto } from "./product-packaging";
import { WeightDto } from "./weight";

export interface ProductOptionDto {
    id?: string;
    name: string;
    description: string;
    optionId?: string | null;
    optionGroupId?: string;
    imagePath?: string;
    quantity?: number;
    packagingType?: PackagingType;
  }
  