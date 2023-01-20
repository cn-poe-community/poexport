import { BaseType, BaseTypeIndexEntry, BaseTypeMap } from "../type/basetype.type";

import weapons from "../asset/weapons.json";
import accessories from "../asset/accessories.json";
import armour from "../asset/armour.json";
import flasks from "../asset/flasks.json";
import jewels from "../asset/jewels.json";
import { Language } from "../type/language.type";
import { EquipmentCategory } from "../type/category.type";

export class BaseTypeProvider {
    private readonly baseTypeIndexByZhText = new Map<String, BaseTypeIndexEntry[]>();
    private readonly baseTypeIndexByUniqueZhText = new Map<String, BaseTypeIndexEntry[]>();

    constructor() {
        const language = Language.Chinese;
        const categories = Object.values(EquipmentCategory).filter((x) => isNaN(Number(x)));

        for (const c of categories) {
            const category = c as EquipmentCategory;
            const baseTypeMap = this.provide(category);

            for (const id in baseTypeMap) {
                const data = baseTypeMap[id];
                const zhText = data.text[language];
                if (this.baseTypeIndexByZhText.has(zhText)) {
                        this.baseTypeIndexByZhText.get(zhText)?.push({ "category": category, "id": id });
                } else {
                    this.baseTypeIndexByZhText.set(zhText, [{ "category": category, "id": id }]);
                }

                const uniques = data.uniques;
                for (const uid in uniques) {
                    const udata = uniques[uid];
                    const uzhText = udata.text[language];
                    if (uzhText in this.baseTypeIndexByUniqueZhText) {
                        this.baseTypeIndexByUniqueZhText.get(uzhText)?.push({ "category": category, "id": id });
                    } else {
                        this.baseTypeIndexByUniqueZhText.set(uzhText, [{ "category": category, "id": id }]);
                    }
                }
            }
        }
    }


    public provide(group: EquipmentCategory): BaseTypeMap {
        switch (group) {
            case EquipmentCategory.Weapon:
                return weapons;
            case EquipmentCategory.Accessory:
                return accessories;
            case EquipmentCategory.Armour:
                return armour;
            case EquipmentCategory.Flask:
                return flasks;
            case EquipmentCategory.Jewel:
                return jewels;
        }
    }

    public provideBaseType(category: EquipmentCategory, id: string): BaseType | null {
        const baseTypeMap = this.provide(category)
        if (id in baseTypeMap) {
            return baseTypeMap[id];
        }
        return null;
    }

    public provideBaseTypeByZhText(zhText: string): BaseType[] {
        const entries = this.baseTypeIndexByZhText.get(zhText);
        if (entries) {
            let val: BaseType[] = [];
            for (const entry of entries) {
                let baseType = this.provideBaseType(entry.category, entry.id);
                if (baseType) {
                    val.push(baseType);
                }
            }
            return val;
        }

        return [];
    }
}