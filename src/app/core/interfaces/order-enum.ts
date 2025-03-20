export enum OrderType {
    DELIVERY = "DELIVERY",
    TAKEOUT = "TAKEOUT",
    INDOOR = "INDOOR",
    TABLE = "TABLE"

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
    IFOOD = "IFOOD",
    ROTAFOOD = "ROTAFOOD"

  }
  
  export enum OrderTiming {
    IMMEDIATE = "IMMEDIATE",
    SCHEDULED = "SCHEDULED",
  }


  export enum OrderDeliveryMode {
    DEFAULT = 'DEFAULT', 
    ECONOMIC = 'ECONOMIC', 
    EXPRESS = 'EXPRESS'
  }
  
  export enum OrderDeliveryBy {
    MERCHANT = "MERCHANT",
    PLATFORM = "PLATFORM",
    CUSTOMER = "CUSTOMER",
  }

  

  export enum OrderIndoorDtoMode {
    DEFAULT = "DEFAULT",
    TABLE = "TABLE",
  }
  

export enum OrderTakeoutMode {
    DEFAULT = "DEFAULT",
    PICKUP_AREA = "PICKUP_AREA",
}
  

export const OrderTypeMap: Record<OrderType, string> = {
  [OrderType.DELIVERY]: "Entrega",
  [OrderType.TAKEOUT]: "Retirada",
  [OrderType.INDOOR]: "Consumo no Local",
  [OrderType.TABLE]: "Pedido na Mesa"
};

export const OrderStatusMap: Record<OrderStatus, string> = {
  [OrderStatus.CREATED]: "Criado",
  [OrderStatus.CONFIRMED]: "Confirmado",
  [OrderStatus.PREPARATION_STARTED]: "Em Preparação",
  [OrderStatus.READY_TO_PICKUP]: "Pronto para Retirada",
  [OrderStatus.DISPATCHED]: "Despachado",
  [OrderStatus.COMPLETED]: "Concluído",
  [OrderStatus.CANCELED]: "Cancelado"
};

export const OrderSalesChannelMap: Record<OrderSalesChannel, string> = {
  [OrderSalesChannel.CALL]: "Ligação",
  [OrderSalesChannel.WHATSAPP]: "WhatsApp",
  [OrderSalesChannel.FACEBOOK]: "Facebook",
  [OrderSalesChannel.INSTAGRAM]: "Instagram",
  [OrderSalesChannel.IFOOD]: "iFood",
  [OrderSalesChannel.ROTAFOOD]: "RotaFood"
};

export const OrderTimingMap: Record<OrderTiming, string> = {
  [OrderTiming.IMMEDIATE]: "Imediato",
  [OrderTiming.SCHEDULED]: "Agendado"
};

export const OrderDeliveryModeMap: Record<OrderDeliveryMode, string> = {
  [OrderDeliveryMode.DEFAULT]: "Padrão",
  [OrderDeliveryMode.ECONOMIC]: "Econômica",
  [OrderDeliveryMode.EXPRESS]: "Expresso"
};

export const OrderDeliveryByMap: Record<OrderDeliveryBy, string> = {
  [OrderDeliveryBy.MERCHANT]: "Entrega pelo Estabelecimento",
  [OrderDeliveryBy.PLATFORM]: "Entrega pela Plataforma",
  [OrderDeliveryBy.CUSTOMER]: "Retirada pelo Cliente"
};


export const OrderIndoorDtoModeMap: Record<OrderIndoorDtoMode, string> = {
  [OrderIndoorDtoMode.DEFAULT]: "Padrão",
  [OrderIndoorDtoMode.TABLE]: "Mesa"
};

export const OrderTakeoutModeMap: Record<OrderTakeoutMode, string> = {
  [OrderTakeoutMode.DEFAULT]: "Padrão",
  [OrderTakeoutMode.PICKUP_AREA]: "Área de Retirada"
};
