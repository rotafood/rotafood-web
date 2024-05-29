import { Address } from "./address";

export interface Coordinate {
  lat: number;
  lon: number;
}

export interface CvrpBase {
  id?: string;
  address: Address
}

export interface CvrpOrder {
    id?: string;
    volumeLiters: number;
    createdAt: Date;
    address: Address;
  }  

export interface CvrpRoute {
    id?: string;
    sequence: number[];
    orders: CvrpOrder[];
    routeLine: Coordinate[];
    distanceKm: number;
    volumeLiters: number;
    linkGoogleMaps: string;
  }

export interface Cvrp {
  id?: string;
  base: CvrpBase;
  maxRouteVolume: number;
  maxRouteOrders: number;
  routes: CvrpRoute[]
}


  