import { StatProvider } from "../provider/stat.provider";
import { Stat } from "../type/stat.type";
import { StatUtil } from "../util/stat.util";
import { PassiveSkillService } from "./passiveskill.service";

const ZhImpossibleEscapeModRegExp = /^(.+)范围内的天赋可以在\n未连结至天赋树的情况下配置$/;
const ZhAnointedModRegExp = /^配置 (.+)$/;
const ZhForbiddenFleshModRegExp = /^禁断之火上有匹配的词缀则配置 (.+)$/;
const ZhForbiddenFlameModRegExp = /^禁断之肉上有匹配的词缀则配置 (.+)$/;

export class StatService {
    private readonly passiveSkillService: PassiveSkillService;
    private readonly statProvider: StatProvider;

    constructor(passiveSkillService: PassiveSkillService, statProvider: StatProvider) {
        this.passiveSkillService = passiveSkillService;
        this.statProvider = statProvider;
    }

    public translateMod(zhMod: string, zhBaseType: string): string | null {
        let res = this.dealWithPassiveSkillMod(zhMod, zhBaseType);
        if (res || res === null) {
            return res;
        }

        const body = StatUtil.getBodyOfModifier(zhMod);
        const stats = this.statProvider.provideStatByZhBody(body);

        if (stats) {
            return this.doTranslate(stats, zhMod);
        }

        const mapping = this.statProvider.provideMappingEntryByZhParts(StatUtil.getNonAscii(zhMod));
        if (mapping) {
            const r = new RegExp(mapping.before);

            if (r.exec(zhMod)) {
                zhMod = StatUtil.render(mapping.after, mapping.before, zhMod);
            }

            const body = StatUtil.getBodyOfModifier(zhMod);
            const stats = this.statProvider.provideStatByZhBody(body);

            if (stats) {
                return this.doTranslate(stats, zhMod);
            }
        }


        return null;
    }

    dealWithPassiveSkillMod(zhMod: string, zhBaseType: string): string | null | undefined {
        let matches = ZhImpossibleEscapeModRegExp.exec(zhMod);
        if (matches) {
            let zhKeystone = matches[1];
            let keystone = this.passiveSkillService.translateKeystone(zhKeystone);
            if (keystone) {
                return `Passives in Radius of ${keystone} can be Allocated\nwithout being connected to your tree`
            } else {
                return null;
            }
        }

        matches = ZhAnointedModRegExp.exec(zhMod);
        if (matches) {
            let zhNoteable = matches[1];
            let notable = this.passiveSkillService.translateNotable(zhNoteable);
            if (notable) {
                return `Allocates ${notable}`;
            } else {
                return null;
            }
        }

        matches = ZhForbiddenFlameModRegExp.exec(zhMod);
        if (matches) {
            let zhAscendant = matches[1];
            let ascendant = this.passiveSkillService.translateAscendant(zhAscendant);
            if (ascendant) {
                return `Allocates ${ascendant} if you have the matching modifier on Forbidden Flesh`;
            }
        }

        matches = ZhForbiddenFleshModRegExp.exec(zhMod);
        if (matches) {
            let zhAscendant = matches[1];
            let ascendant = this.passiveSkillService.translateAscendant(zhAscendant);
            if (ascendant) {
                return `Allocates ${ascendant} if you have the matching modifier on Forbidden Flame`;
            }
        }

        return undefined;
    }

    doTranslate(stats: Stat | Array<Stat>, zhMod: string): string | null {
        if (Array.isArray(stats)) {
            for (const stat of stats) {
                const val = this.dotranslateMod(stat, zhMod);
                if (val) {
                    return val;
                }
            }
        } else {
            return this.dotranslateMod(stats, zhMod);
        }

        return null;
    }

    dotranslateMod(stat: Stat, zhMod: string): string | null {
        const r = new RegExp(stat.zh);
        let matches = r.exec(zhMod);

        if (matches) {
            return StatUtil.render(stat.en, stat.zh, zhMod);
        }

        return null;
    }
}