import attributes from "../asset/attributes.json";
import { Attribute } from "../type/attribute.type";

export class AttributeProvider {
    private readonly attrIndexedByZhName = new Map<string, Attribute>();

    constructor() {
        const attrList = attributes as unknown as Array<Attribute>;
        for (const p of attrList) {
            const zh = p.zh;
            this.attrIndexedByZhName.set(zh, p);
        }
    }

    public provideAttribute(zhName: string): Attribute | undefined {
        return this.attrIndexedByZhName.get(zhName);
    }
}
