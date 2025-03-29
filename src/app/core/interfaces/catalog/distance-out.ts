import { AddressDto, CoordinateDto } from "../address";

export interface RouteDto {
  id: string;
  origin: AddressDto;
  destiny: AddressDto;
  routeLine: CoordinateDto[];
  distanceMeters: number;
  deliveryFee: number;
}
