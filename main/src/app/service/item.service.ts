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

        for (let b of baseTypes) {
            let uniques = b.uniques;
            for (let uid in uniques) {
                let udata = uniques[uid];
                let uzhText = udata.text[Language.Chinese];
                if (uzhText === zhName) {
                    return udata.text[Language.English];
                }
            }
        }

        return DEFAULT_NAME;
    }

}