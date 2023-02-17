import { PropertyProvider } from "../provider/property.provider";
import { ZH_PROPERTY_NAME_LIMITED_TO } from "../type/property.type";

export class PropertyService {
    private readonly propertyProvider: PropertyProvider;

    constructor(propertyProvider: PropertyProvider) {
        this.propertyProvider = propertyProvider;
    }

    public translate(zhName: string, zhValue: string): { name: string | undefined, value: string | undefined } | undefined {
        const p = this.propertyProvider.provideProperty(zhName);
        if (p) {
            const enName = p.en;
            if (zhValue && p.values) {
                for (const v of p.values) {
                    if (zhValue === v.zh) {
                        return {
                            name: enName,
                            value: v.en,
                        }
                    }
                }
            }

            return {
                name: enName,
                value: undefined,
            }
        }
        return;
    }
}