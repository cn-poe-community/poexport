export interface Character {
    class: string,
    name: string,
    league: string,
}

export interface PassiveSkills {
    items: Array<any>,
}

export interface Items {
    items: Array<any>,
}

export class HttpError {
    status: number;

    constructor(status: number) {
        this.status = status;
    }
}