import gems from "../asset/gems.json";
import { Gem } from "../type/gem.type";
import { Language } from "../type/language.type";

export class GemProvider {
    private readonly skillsIndexByZh = new Map<string, string>();

    constructor() {
        for (const gem in gems) {
            const data = (gems as { [id: string]: Gem })[gem] as Gem;
            const skills = data.skills;
            for (const skill in skills) {
                const skillData = skills[skill];
                const zhSkill = skillData.text[Language.CHINESE];
                this.skillsIndexByZh.set(zhSkill, skill);
            }
        }
    }

    public provideSkills(): Map<string, string> {
        return this.skillsIndexByZh;
    }
}
