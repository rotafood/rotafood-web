export enum OrderStatus {
    CREATED = 'CREATED',
    CONFIRMED = 'CONFIRMED',
    PREPARATION_STARTED = 'PREPARATION_STARTED',
    READY_TO_PICKUP = 'READY_TO_PICKUP',
    DISPATCHED = 'DISPATCHED',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
    ALL = 'ALL'
  }
  

  export const orderStatusMap: Record<OrderStatus, string> = {
    [OrderStatus.CREATED]: 'Criado',
    [OrderStatus.CONFIRMED]: 'Confirmado',
    [OrderStatus.PREPARATION_STARTED]: 'Em Preparação',
    [OrderStatus.READY_TO_PICKUP]: 'Pronto para Retirada',
    [OrderStatus.DISPATCHED]: 'Despachado',
    [OrderStatus.COMPLETED]: 'Concluído',
    [OrderStatus.CANCELED]: 'Cancelado',
    [OrderStatus.ALL]: 'Todos'
  };