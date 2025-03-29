import { PackagingType } from "../../enums/packagiong-type";
import { Serving } from "../../enums/serving";
import { ItemOptionGroupDto } from "./product-option-group";
import { ProductPackagingDto } from "./product-packaging";

export interface ProductDto {
    id?: string;
    name: string;
    description: string;
    ean?: string;
    additionalInformation?: string;
    serving?: Serving;
    itemId?: string | null;
    optionId?: string | null;
    packaging?: ProductPackagingDto;
    imagePath?: string;
    quantity?: number;
    packagingType?: PackagingType;
  }
  