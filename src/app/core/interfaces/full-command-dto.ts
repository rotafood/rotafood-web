import { FullOrderDto } from './full-order';

export interface FullCommandDto {
  id: string;
  name: string;
  merchantSequence: number;
  tableIndex: number;
  pending: number;      
  prepaid: number;    
  orders: FullOrderDto[];
}
