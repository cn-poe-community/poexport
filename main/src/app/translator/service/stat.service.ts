import { StatProvider } from "../provider/stat.provider";
import { COMPOUNDED_STAT_LINE_SEPARATOR, Stat } from "../type/stat.type";
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

    public translateMod(zhMod: string): string | null {
        const res = this.dealWithPassiveSkillMod(zhMod);
        if (res || res === null) {
            return res;
        }

        const body = StatUtil.getBodyOfZhModifier(zhMod);
        const stats = this.statProvider.provideStatByZhBody(body);

        if (stats) {
            const result = this.doTranslate(stats, zhMod);
            if (result) {
                return result;
            }
        }

        return null;
    }

    dealWithPassiveSkillMod(zhMod: string): string | null | undefined {
        let matches = ZhImpossibleEscapeModRegExp.exec(zhMod);
        if (matches) {
            const zhKeystone = matches[1];
            const keystone = this.passiveSkillService.translateKeystone(zhKeystone);
            if (keystone) {
                return `Passives in Radius of ${keystone} can be Allocated\nwithout being connected to your tree`
            } else {
                return null;
            }
        }

        matches = ZhAnointedModRegExp.exec(zhMod);
        if (matches) {
            const zhNoteable = matches[1];
            const notable = this.passiveSkillService.translateNotable(zhNoteable);
            if (notable) {
                return `Allocates ${notable}`;
            } else {
                return null;
            }
        }

        matches = ZhForbiddenFlameModRegExp.exec(zhMod);
        if (matches) {
            const zhAscendant = matches[1];
            const ascendant = this.passiveSkillService.translateAscendant(zhAscendant);
            if (ascendant) {
                return `Allocates ${ascendant} if you have the matching modifier on Forbidden Flesh`;
            }
        }

        matches = ZhForbiddenFleshModRegExp.exec(zhMod);
        if (matches) {
            const zhAscendant = matches[1];
            const ascendant = this.passiveSkillService.translateAscendant(zhAscendant);
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
        const matches = r.exec(zhMod);

        if (matches) {
            return StatUtil.render(stat.en, stat.zh, zhMod);
        }

        return null;
    }

    public getMaxLineSizeOfCompoundedMod(firstLine: string): number {
        const body = StatUtil.getBodyOfZhModifier(firstLine);
        const stats = this.statProvider.providecompoundedStatByFirstLinesZhBody(body);
        if (stats) {
            return stats.maxLineSize;
        }

        return 0;
    }

    public translateCompoundedMod(lines: string[]): { result: string, lineSize: number } | undefined {
        const body = StatUtil.getBodyOfZhModifier(lines[0]);
        const stats = this.statProvider.providecompoundedStatByFirstLinesZhBody(body);
        if (!stats) {
            return;
        }

        for (const compoundedStat of stats.stats) {
            const lineSize = compoundedStat.lineSize;
            if (compoundedStat.lineSize > lines.length) {
                continue;
            }
            const stat = compoundedStat.stat;
            const mod = lines.slice(0, lineSize).join(COMPOUNDED_STAT_LINE_SEPARATOR);

            if (StatUtil.getBodyOfZhTemplate(stat.zh) ===
                StatUtil.getBodyOfZhModifier(mod)) {
                const result = this.dotranslateMod(stat, mod);
                if (result) {
                    return {
                        result: result,
                        lineSize: lineSize,
                    }
                }
            }
        }
    }
}