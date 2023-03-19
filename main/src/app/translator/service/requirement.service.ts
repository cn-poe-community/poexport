import { RequirementProvider } from "../provider/requirement.provider";
import { ZH_REQUIREMENT_NAME_CLASS } from "../type/requirement.type";
import { CharacterService } from "./character.service";

export class RequirementSerivce {
    private readonly requirementProvider: RequirementProvider;
    private readonly characterService: CharacterService;

    constructor(
        requirementProvider: RequirementProvider,
        characterService: CharacterService
    ) {
        this.requirementProvider = requirementProvider;
        this.characterService = characterService;
    }

    public translateName(zhName: string): string | undefined {
        const names = this.requirementProvider.provideNames();
        return names.get(zhName);
    }

    public translateValue(zhName: string, zhValue: string): string | undefined {
        if (zhName === ZH_REQUIREMENT_NAME_CLASS) {
            return this.characterService.translateClass(zhValue);
        }
        return undefined;
    }

    public translateSuffix(zhSuffix: string): string | undefined {
        const suffixes = this.requirementProvider.provideSuffixes();
        return suffixes.get(zhSuffix);
    }
}
