import { Status } from "../enums/status";
import { TempleteType } from "../enums/template-type";
import { ItemDto } from "./item";

export interface GetCategoryDto {
  id: string;
  index: number;
  name: string;
  template: TempleteType;
  status: Status; 
  items: ItemDto[];
}


export interface CategoryDto {
    id: string;
    index: number;
    name: string;
    template: TempleteType;
    status: Status; 
  }
