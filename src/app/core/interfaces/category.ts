import { Status } from "../enums/status";
import { ItemDto } from "./item";

export interface GetCategoryDto {
  id: string;
  index: number;
  name: string;
  status: Status; 
  items: ItemDto[];
}


export interface CategoryDto {
    id: string;
    index: number;
    name: string;
    status: Status; 
  }
