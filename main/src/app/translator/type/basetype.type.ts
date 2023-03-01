import { EquipmentCategory } from "./category.type"

export interface BaseTypeMap {
    [id: string]: BaseType
}

export interface BaseType {
    text: {
        [language: number]: string | Array<string>
    }
    uniques: UniqueMap
}

export interface UniqueMap {
    [id: string]: Unique
}

export interface Unique {
    text: {
        [language: number]: string
    },
    isLeague?: boolean,
}

export interface BaseTypeIndexEntry {
    category: EquipmentCategory
    id: string
}