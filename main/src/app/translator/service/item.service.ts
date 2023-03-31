import { BaseTypeProvider } from "../provider/basetype.provider";

const DEFAULT_NAME = "Item";

export class ItemService {
    private readonly baseTypeProvider: BaseTypeProvider;

    constructor(baseTypeProvider: BaseTypeProvider) {
        this.baseTypeProvider = baseTypeProvider;
    }

    /**
     * Tranlate item name, but only unique name is supported.
     *
     * @returns DEFAULT_NAME if no unique with the zhName.
     */
    public translateName(zhName: string, zhBaseType: string): string {
        const baseTypes =
            this.baseTypeProvider.provideBaseTypesByZh(zhBaseType);

        for (const baseType of baseTypes) {
            const uniques = baseType.uniques;
            for (const unique of uniques) {
                if (unique.zh === zhName) {
                    return unique.en;
                }
            }
        }

        return DEFAULT_NAME;
    }
}
