export interface Attribute {
    zh: string;
    en: string;
    values?: AttributeValue[];
}

export interface AttributeValue {
    zh: string;
    en: string;
}

export interface BaseType {
    zh: string;
    en: string;
    uniques?: Unique[];
}

export interface Unique {
    zh: string;
    en: string;
}

export interface Gem {
    zh: string;
    en: string;
}

export interface Skill {
    zh: string;
    en: string;
}

export interface Node {
    id: string;
    zh: string;
    en: string;
}

export interface Property {
    zh: string;
    en: string;
    values?: PropertyValue[];
}

export interface PropertyValue {
    zh: string;
    en: string;
}

export interface Requirement {
    zh: string;
    en: string;
    values?: RequirementValue[];
}

export interface RequirementValue {
    zh: string;
    en: string;
}

export interface RequirementSuffix {
    zh: string;
    en: string;
}

export interface Stat {
    zh: string;
    en: string;
}

export interface Assets {
    accessories: BaseType[];
    armour: BaseType[];
    weapons: BaseType[];
    flasks: BaseType[];
    jewels: BaseType[];
    gems: Gem[];
    hybridSkills: Skill[],
    attributes: Attribute[];
    properties: Property[];
    requirements: Requirement[];
    requirementSuffixes: RequirementSuffix[];
    ascendant: Node[];
    keystones: Node[];
    notables: Node[];
    stats: Stat[];
    tattoos: BaseType[];
}