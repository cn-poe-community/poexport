import { transform } from "pob-building-creater";

export function create(items: any, passiveSkills: any): string {
    const pob = transform(items, passiveSkills);
    return pob.toString();
}
