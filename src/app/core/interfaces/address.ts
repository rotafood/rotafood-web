export interface Address {
    id?: number | null;
    streetName: string;
    formattedAddress: string;
    streetNumber: string;
    city: string;
    postalCode: string;
    neighborhood: string;
    state: string;
    complement: string;
    latitude: number;
    longitude: number;
  }