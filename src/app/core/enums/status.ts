export enum Status {
    AVALIABLE = 'AVALIABLE',
    UNAVAILABLE = 'UNAVAILABLE'
}

export const statusToString: { [key in Status]: string } = {
    [Status.AVALIABLE]: 'Ativado',
    [Status.UNAVAILABLE]: 'Pausado',
};