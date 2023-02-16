import { PassiveSkillProvider } from "../provider/passiveskill.provider";
import { Language } from "../type/language.type";

export class PassiveSkillService {
    private readonly passiveSkillProvider: PassiveSkillProvider;

    constructor(passiveSkillProvider: PassiveSkillProvider) {
        this.passiveSkillProvider = passiveSkillProvider;
    }

    public translateNotable(zh: string): string | null {
        const node = this.passiveSkillProvider.provideNotableByZhName(zh);
        if (node) {
            return node.name[Language.English];
        }

        return null;
    }

    public translateKeystone(zh: string): string | null {
        const node = this.passiveSkillProvider.provideKeystoneByZhName(zh);
        if (node) {
            return node.name[Language.English];
        }

        return null;
    }

    public translateAscendant(zh: string): string | null {
        const node = this.passiveSkillProvider.provideAscendantByZhName(zh);
        if (node) {
            return node.name[Language.English];
        }

        return null;
    }
}