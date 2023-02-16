import { names, values } from "../asset/properties.json";
import { Language } from "../type/language.type";
import { PropertyName, PropertyValue } from "../type/property.type";

export class PropertyProvider {
    private readonly namesIndexByZhText = new Map<string, string>();
    private readonly valuesIndexByZhText = new Map<string, string>();

    constructor() {
        for (const name in names) {
            const data = (names as { [id: string]: PropertyName })[name] as PropertyName;
            const zhName = data.text[Language.Chinese];
            this.namesIndexByZhText.set(zhName, name);
        }

        for (const value in values) {
            const data = (values as { [id: string]: PropertyValue })[value] as PropertyValue;
            const zhValue = data.text[Language.Chinese];
            this.valuesIndexByZhText.set(zhValue, value);
        }
    }

    public provideNames(): Map<string, string> {
        return this.namesIndexByZhText;
    }

    public provideValues(): Map<string, string> {
        return this.valuesIndexByZhText;
    }
}