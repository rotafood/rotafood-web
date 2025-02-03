export interface OrderItemDetailDto {
    id: string;
    name: string;
    description: string;
    ean?: string;
    additionalInformation?: string;
    serving: string;
    imagePath?: string;
  }
  