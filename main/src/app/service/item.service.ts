import { BaseTypeProvider } from "../provider/basetype.provider";
import { Language } from "../type/language.type";

const DEFAULT_NAME = "Item";

export class ItemService {
    private readonly baseTypeProvider: BaseTypeProvider;

    constructor(baseTypeProvider: BaseTypeProvider) {
        this.baseTypeProvider = baseTypeProvider;
    }

    public translateName(zhName: string, zhBaseType: string): string {
        const baseTypes = this.baseTypeProvider.provideBaseTypeByZhText(zhBaseType);

        for (const b of baseTypes) {
            const uniques = b.uniques;
            for (const uid in uniques) {
                const udata = uniques[uid];
                const uzhText = udata.text[Language.Chinese];
                if (uzhText === zhName) {
                    return udata.text[Language.English];
                }
            }
        }

        return DEFAULT_NAME;
    }

}