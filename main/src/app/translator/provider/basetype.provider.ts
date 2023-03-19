import { BaseType } from "../type/basetype.type";

import weapons from "../asset/weapons.json";
import accessories from "../asset/accessories.json";
import armour from "../asset/armour.json";
import flasks from "../asset/flasks.json";
import jewels from "../asset/jewels.json";
import { EquipmentCategory } from "../type/category.type";

export class BaseTypeProvider {
    private readonly baseTypesIndexedByZh = new Map<string, BaseType[]>();
    private readonly baseTypesIndexedByUniqueZh = new Map<string, BaseType[]>();

    constructor() {
        const categories = Object.values(EquipmentCategory).filter((x) =>
            isNaN(Number(x))
        );

        for (const category of categories) {
            const baseTypeList = this.provideBaseTypesByCategory(category);

            for (const baseType of baseTypeList) {
                const zh = baseType.zh;
                if (Array.isArray(zh)) {
                    for (const text of zh) {
                        if (this.baseTypesIndexedByZh.has(text)) {
                            this.baseTypesIndexedByZh.get(text)?.push(baseType);
                        } else {
                            this.baseTypesIndexedByZh.set(text, [baseType]);
                        }
                    }
                } else {
                    if (this.baseTypesIndexedByZh.has(zh)) {
                        this.baseTypesIndexedByZh.get(zh)?.push(baseType);
                    } else {
                        this.baseTypesIndexedByZh.set(zh, [baseType]);
                    }
                }

                const uniques = baseType.uniques;
                for (const unique of uniques) {
                    const zh = unique.zh;
                    if (zh in this.baseTypesIndexedByUniqueZh) {
                        this.baseTypesIndexedByUniqueZh.get(zh)?.push(baseType);
                    } else {
                        this.baseTypesIndexedByUniqueZh.set(zh, [baseType]);
                    }
                }
            }
        }
    }

    private provideBaseTypesByCategory(
        category: EquipmentCategory
    ): BaseType[] {
        switch (category) {
            case EquipmentCategory.WEAPON:
                return weapons;
            case EquipmentCategory.ACCESSORY:
                return accessories;
            case EquipmentCategory.ARMOUR:
                return armour;
            case EquipmentCategory.FLASK:
                return flasks;
            case EquipmentCategory.JEWEL:
                return jewels;
        }
    }

    public provideBaseTypesByZh(zh: string): BaseType[] | undefined {
        const entries = this.baseTypesIndexedByZh.get(zh);

        return entries;
    }
}
