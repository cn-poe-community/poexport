import { EquipmentCategory } from "./category.type"

export interface BaseTypeMap {
    [id: string]: BaseType
}

export interface BaseType {
    text: {
        [language: number]: string
    }
    uniques: UniqueMap
}

export interface UniqueMap {
    [id: string]: Unique
}

export interface Unique {
    text: {
        [language: number]: string
    }
}

export interface BaseTypeIndexEntry {
    category: EquipmentCategory
    id: string
}