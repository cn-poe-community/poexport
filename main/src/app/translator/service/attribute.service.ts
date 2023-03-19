import { AttributeProvider } from "../provider/attribute.provider";

export class AttributeService {
    private readonly attrProvider: AttributeProvider;

    constructor(attrProvider: AttributeProvider) {
        this.attrProvider = attrProvider;
    }

    public translatePair(
        zhName: string,
        zhValue: string
    ): { name: string; value?: string } | undefined {
        return this.doTranslate(zhName, zhValue);
    }

    public translateName(zhName: string): string | undefined {
        const result = this.doTranslate(zhName, undefined);
        if (result !== undefined) {
            return result.name;
        }
    }

    private doTranslate(
        zhName: string,
        zhValue?: string
    ): { name: string; value?: string } | undefined {
        const attr = this.attrProvider.provideAttribute(zhName);
        if (attr !== undefined) {
            const enName = attr.en;
            if (zhValue !== undefined && attr.values !== undefined) {
                for (const v of attr.values) {
                    if (zhValue === v.zh) {
                        return {
                            name: enName,
                            value: v.en,
                        };
                    }
                }
            }

            return {
                name: enName,
                value: undefined,
            };
        }
    }
}
