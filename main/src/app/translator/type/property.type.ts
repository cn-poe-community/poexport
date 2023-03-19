export interface Property {
    zh: string;
    en: string;
    values: PropertyValue[];
}

export interface PropertyValue {
    zh: string;
    en: string;
}

export const ZH_PROPERTY_NAME_LIMITED_TO = "仅限";
export const ZH_PROPERTY_NAME_RADIUS = "范围";
