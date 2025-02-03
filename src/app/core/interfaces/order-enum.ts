export enum OrderType {
    DELIVERY = "DELIVERY",
    TAKEOUT = "TAKEOUT",
    INDOOR = "INDOOR",
  }
  
  export enum OrderStatus {
    CREATED = "CREATED",
    CONFIRMED = "CONFIRMED",
    PREPARATION_STARTED = "PREPARATION_STARTED",
    READY_TO_PICKUP = "READY_TO_PICKUP",
    DISPATCHED = "DISPATCHED",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
  }
  
  export enum OrderSalesChannel {
    CALL = "CALL",
    WHATSAPP = "WHATSAPP",
    FACEBOOK = "FACEBOOK",
    INSTAGRAM = "INSTAGRAM",
    IFOOD = "IFOOD"
  }
  
  export enum OrderTiming {
    IMMEDIATE = "IMMEDIATE",
    SCHEDULED = "SCHEDULED",
  }


  export enum OrderDeliveryDtoMode {
    STANDARD = "STANDARD",
    EXPRESS = "EXPRESS",
  }
  
  export enum OrderDeliveryDtoBy {
    MERCHANT = "MERCHANT",
    PLATFORM = "PLATFORM",
    CUSTOMER = "CUSTOMER",
  }
  
  export enum OrderDeliveryDtoDescription {
    PICKUP = "PICKUP",
    HOME_DELIVERY = "HOME_DELIVERY",
    DRIVE_THRU = "DRIVE_THRU",
  }
  

  export enum OrderIndoorDtoMode {
    DEFAULT = "DEFAULT",
    TABLE = "TABLE",
  }
  
  