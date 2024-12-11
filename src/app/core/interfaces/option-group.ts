import { Status } from "../enums/status";
import { OptionDto } from "./option";

export interface OptionGroupDto {
    id: string;
    name: string;
    status: Status;
    options: OptionDto[];
  }
  