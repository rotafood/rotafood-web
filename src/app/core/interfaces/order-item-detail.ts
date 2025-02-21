import { Serving } from "../enums/serving";
import { ContextModifierDto } from "./context-modifier";

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
  