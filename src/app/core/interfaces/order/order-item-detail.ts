import { Serving } from "../../enums/serving";
import { ContextModifierDto } from "../catalog/context-modifier";

export interface OrderItemDetailDto {
    id?: string;
    name: string;
    description: string;
    contextModifier: ContextModifierDto;
    ean?: string;
    additionalInformation?: string;
    serving?: Serving;
    imagePath?: string;
  }
  