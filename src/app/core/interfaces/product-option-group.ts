import { Status } from "../enums/status";
import { OptionGroupDto } from "./option-group";

export interface ProductOptionGroupDto {
    id?: string;
    status: Status;
    index?: number;
    min: number;
    max: number;
    itemId?: string;
    optionGroup: OptionGroupDto
}