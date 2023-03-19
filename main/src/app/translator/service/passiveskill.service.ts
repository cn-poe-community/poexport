import { PassiveSkillProvider } from "../provider/passiveskill.provider";
import { Language } from "../type/language.type";

export class PassiveSkillService {
    private readonly passiveSkillProvider: PassiveSkillProvider;

    constructor(passiveSkillProvider: PassiveSkillProvider) {
        this.passiveSkillProvider = passiveSkillProvider;
    }

    public translateNotable(zh: string): string | undefined {
        const node = this.passiveSkillProvider.provideNotableByZhName(zh);
        if (node !== undefined) {
            return node.name[Language.ENGLISH];
        }

        return undefined;
    }

    public translateKeystone(zh: string): string | undefined {
        const node = this.passiveSkillProvider.provideKeystoneByZhName(zh);
        if (node !== undefined) {
            return node.name[Language.ENGLISH];
        }

        return undefined;
    }

    public translateAscendant(zh: string): string | undefined {
        const node = this.passiveSkillProvider.provideAscendantByZhName(zh);
        if (node !== undefined) {
            return node.name[Language.ENGLISH];
        }

        return undefined;
    }
}
