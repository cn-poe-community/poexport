export interface StatMap {
    [id: string]: Stat
}

export interface Stat {
    "text": {
        [id: string]: {
            [id: string]: string
        }
    }
}