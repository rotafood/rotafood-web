import { AddressDto, CoordinateDto } from "./address";

export interface DistanceOutDto {
  id: string;
  origin: AddressDto;
  destiny: AddressDto;
  routeLine: CoordinateDto[];
  distanceMeters: number;
}
