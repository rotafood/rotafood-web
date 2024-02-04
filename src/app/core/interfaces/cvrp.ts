import { Address } from "./address";
import { Merchant } from "./merchant";

export interface CvrpOrder {
    id: number;
    totalVolume: number;
    address: Address;
  }  



export interface CvrpRoute {
    id: number;
    sequence: number[];
    orders: CvrpOrder[];
    points: [number, number][];
    distance: number;
    volume: number;
    linkGoogleMaps: string;
  }

export interface Cvrp {
  merchant: Merchant;
  driversVolume: number;
  routes: CvrpRoute[]
}
  