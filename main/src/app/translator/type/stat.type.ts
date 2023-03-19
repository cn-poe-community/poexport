export interface Stat {
    id: string;
    zh: string;
    en: string;
}

export interface CompoundedStatIndexEntry {
    maxLineSize: number;
    stats: CompoundedStat[];
}

export interface CompoundedStat {
    lineSize: number;
    stat: Stat;
}

export const COMPOUNDED_STAT_LINE_SEPARATOR = "\n";
