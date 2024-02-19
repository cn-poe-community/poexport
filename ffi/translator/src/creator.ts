import { transform } from "pob-building-creater";

function create(items: any, passiveSkills: any): string {
    const pob = transform(items, passiveSkills);
    return pob.toString();
}

export default {
    create,
};
