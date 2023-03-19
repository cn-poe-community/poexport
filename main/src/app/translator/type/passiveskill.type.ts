export interface NodeMap {
    [id: string]: Node;
}

export interface Node {
    name: {
        [id: string]: string;
    };
    stats?: {
        [id: string]: string;
    };
}
