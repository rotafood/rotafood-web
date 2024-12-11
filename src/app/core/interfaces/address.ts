export interface Address {
    id?: string | null;
    state: string;
    city: string;
    country: string;
    streetName: string;
    formattedAddress: string;
    streetNumber: string;
    postalCode: string;
    neighborhood: string;
    complement: string;
    latitude: number;
    longitude: number;
  }