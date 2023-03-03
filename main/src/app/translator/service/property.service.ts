import { PropertyProvider } from "../provider/property.provider";

export class PropertyService {
    private readonly propProvider: PropertyProvider;

    constructor(propProvider: PropertyProvider) {
        this.propProvider = propProvider;
    }

    public translatePair(zhName: string, zhValue: string): { name: string, value?: string } | undefined {
        return this.doTranslate(zhName, zhValue);
    }

    public translateName(zhName: string): string | undefined {
        const result = this.doTranslate(zhName, undefined);
        if (result !== undefined) {
            return result.name;
        }
    }

    private doTranslate(zhName: string, zhValue?: string): { name: string, value?: string } | undefined {
        const prop = this.propProvider.provideProperty(zhName);
        if (prop !== undefined) {
            const enName = prop.en;
            if (zhValue !== undefined && prop.values !== undefined) {
                for (const v of prop.values) {
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
    }
}