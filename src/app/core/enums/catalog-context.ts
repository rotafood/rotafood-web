export enum CatalogContext {
    TABLE = 'TABLE',
    DELIVERY = 'DELIVERY',
    IFOOD = 'IFOOD'
}

export const catalogContextToString: Record<any, string> = {
    [CatalogContext.TABLE]: 'na Mesa',
    [CatalogContext.DELIVERY]: 'Delivery',
    [CatalogContext.IFOOD]: 'iFood',
};