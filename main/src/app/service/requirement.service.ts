import { RequirementProvider } from "../provider/requirement.provider";
import { ZH_REQUIREMENT_NAME_CLASS } from "../type/requirement.type";
import { CharacterService } from "./character.service";

export class RequirementSerivce {
    private readonly requirementProvider: RequirementProvider;
    private readonly characterService: CharacterService;

    constructor(requirementProvider: RequirementProvider, characterService: CharacterService) {
        this.requirementProvider = requirementProvider;
        this.characterService = characterService;
    }

    public translateName(zhName: string): string | null {
        const names = this.requirementProvider.provideNames();
        const name = names.get(zhName);

        return name ? name : null;
    }

    public translateValue(zhName: string, zhValue: string): string | null {
        if (zhName === ZH_REQUIREMENT_NAME_CLASS) {
            let res = this.characterService.translateClass(zhValue);
            return res;
        }
        return null;
    }

    public translateSuffix(zhSuffix: string): string | null {
        const suffixes = this.requirementProvider.provideSuffixes();
        const suffix = suffixes.get(zhSuffix);

        return suffix ? suffix : null;
    }
}