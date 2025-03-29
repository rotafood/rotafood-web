import { ContextModifierDto } from "../catalog/context-modifier";

export interface OrderOptionDetailDto {
  id?: string;
  name: string;
  description?: string;
  ean?: string;
  contextModifier: ContextModifierDto,
  additionalInformation?: string;
  serving?: string | null;
  imagePath?: string;
  quantity: number;
  optionGroupName?: string;
  optionGroupId?: string;
}
