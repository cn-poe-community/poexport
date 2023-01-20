import { names, suffixes } from "../asset/requirements.json";
import { Language } from "../type/language.type";
import { RequirementName, RequirementSuffix } from "../type/requirement.type";

export class RequirementProvider {
    private readonly namesIndexByZhText = new Map<string, string>();
    private readonly suffixesIndexByZhText = new Map<string, string>();

    constructor() {
        for (const name in names) {
            const data = (names as { [id: string]: RequirementName })[name] as RequirementName;
            const zhName = data.text[Language.Chinese];
            this.namesIndexByZhText.set(zhName, name);
        }

        for (const suffix in suffixes) {
            const data = (suffixes as { [id: string]: RequirementSuffix })[suffix] as RequirementSuffix;
            const zhSuffix = data.text[Language.Chinese];
            this.suffixesIndexByZhText.set(zhSuffix, suffix);
        }
    }

    public provideNames(): Map<string, string> {
        return this.namesIndexByZhText;
    }

    public provideSuffixes(): Map<string, string> {
        return this.suffixesIndexByZhText;
    }
}