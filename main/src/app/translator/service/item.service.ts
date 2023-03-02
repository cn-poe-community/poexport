import { BaseTypeProvider } from "../provider/basetype.provider";

const DEFAULT_NAME = "Item";

export class ItemService {
    private readonly baseTypeProvider: BaseTypeProvider;

    constructor(baseTypeProvider: BaseTypeProvider) {
        this.baseTypeProvider = baseTypeProvider;
    }

    public translateName(zhName: string, zhBaseType: string): string {
        const baseTypes = this.baseTypeProvider.provideBaseTypesByZh(zhBaseType);

        for (const baseType of baseTypes) {
            const uniques = baseType.uniques;
            for (const unique of uniques) {
                const uniqueZh = unique.zh;
                if (uniqueZh === zhName) {
                    return unique.en;
                }
            }
        }

        return DEFAULT_NAME;
    }

}