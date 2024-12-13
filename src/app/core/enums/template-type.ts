export enum TempleteType {
    DEFAULT = 'DEFAULT',
    PIZZA = 'PIZZA'
}

export const templateTypeToString: { [key in TempleteType]: string } = {
    [TempleteType.DEFAULT]: 'Padrão',
    [TempleteType.PIZZA]: 'Pizza',
};