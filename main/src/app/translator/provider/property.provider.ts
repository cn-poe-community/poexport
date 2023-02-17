import properties from "../asset/properties.json";
import { Property } from "../type/property.type";

export class PropertyProvider {
    private readonly propertyIndexByZhName = new Map<string, Property>();

    constructor() {
        const propertyList = properties as unknown as Array<Property>;
        for (const p of propertyList) {
            const zh = p.zh;
            this.propertyIndexByZhName.set(zh, p);
        }
    }

    public provideProperty(zhName: string): Property {
        return this.propertyIndexByZhName.get(zhName);
    }
}