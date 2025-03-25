import { FullOrderDto } from './full-order';

export interface FullCommandDto {
  id: string;
  name: string;
  merchantSequence: number;
  tableIndex: number;
  total: number;      
  paid: boolean;    
  orders: FullOrderDto[];
}

export interface CommandDto {
  id: string;
  name: string;
  merchantSequence: number;
  tableIndex: number; 
}

