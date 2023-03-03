import { StatProvider } from "../provider/stat.provider";
import { COMPOUNDED_STAT_LINE_SEPARATOR, Stat } from "../type/stat.type";
import { StatUtil, Template } from "../util/stat.util";
import { PassiveSkillService } from "./passiveskill.service";

const ZH_IMPOSSIBLE_ESCAPE_MOD_REGEXP = /^(.+)范围内的天赋可以在\n未连结至天赋树的情况下配置$/;
const ZH_ANOINTED_MOD_REGEXP = /^配置 (.+)$/;
const ZH_FORBIDDEN_FLESH_MOD_REGEXP = /^禁断之火上有匹配的词缀则配置 (.+)$/;
const ZH_FORBIDDEN_FLAME_MOD_REGEXP = /^禁断之肉上有匹配的词缀则配置 (.+)$/;

export class StatService {
    private readonly passiveSkillService: PassiveSkillService;
    private readonly statProvider: StatProvider;

    constructor(passiveSkillService: PassiveSkillService, statProvider: StatProvider) {
        this.passiveSkillService = passiveSkillService;
        this.statProvider = statProvider;
    }

    public translateMod(zhMod: string): string | undefined {
        if (this.isImpossibleEscapeMod(zhMod)) {
            return this.translateImpossibleEscapeMod(zhMod);
        }

        if (this.isAnointedMod(zhMod)) {
            return this.translateAnointedMod(zhMod);
        }

        if (this.isForbiddenFlameMod(zhMod)) {
            return this.translateForbiddenFlameMod(zhMod);
        }

        if (this.isForbiddenFleshMod(zhMod)) {
            return this.translateForbiddenFleshMod(zhMod);
        }

        const body = StatUtil.getBodyOfZhModifier(zhMod);
        const stats = this.statProvider.provideStatsByZhBody(body);

        if (stats !== undefined) {
            for (const stat of stats) {
                const result = this.dotranslateMod(stat, zhMod);
                if (result !== undefined) {
                    return result;
                }
            }
        }

        return undefined;
    }

    isImpossibleEscapeMod(zhMod: string): boolean {
        return ZH_IMPOSSIBLE_ESCAPE_MOD_REGEXP.test(zhMod);
    }

    translateImpossibleEscapeMod(zhMod: string): string | undefined {
        const matches = ZH_IMPOSSIBLE_ESCAPE_MOD_REGEXP.exec(zhMod);
        if (matches !== null) {
            const zhKeystone = matches[1];
            const keystone = this.passiveSkillService.translateKeystone(zhKeystone);
            if (keystone !== undefined) {
                return `Passives in Radius of ${keystone} can be Allocated\nwithout being connected to your tree`
            }
        }

        return undefined;
    }

    isAnointedMod(zhMod: string): boolean {
        return ZH_ANOINTED_MOD_REGEXP.test(zhMod);
    }

    translateAnointedMod(zhMod: string): string | undefined {
        const matches = ZH_ANOINTED_MOD_REGEXP.exec(zhMod);
        if (matches !== null) {
            const zhNoteable = matches[1];
            const notable = this.passiveSkillService.translateNotable(zhNoteable);
            if (notable !== undefined) {
                return `Allocates ${notable}`;
            }
        }
        return undefined;
    }

    isForbiddenFlameMod(zhMod: string): boolean {
        return ZH_FORBIDDEN_FLAME_MOD_REGEXP.test(zhMod);
    }

    translateForbiddenFlameMod(zhMod: string): string | undefined {
        const matches = ZH_FORBIDDEN_FLAME_MOD_REGEXP.exec(zhMod);
        if (matches !== null) {
            const zhAscendant = matches[1];
            const ascendant = this.passiveSkillService.translateAscendant(zhAscendant);
            if (ascendant !== undefined) {
                return `Allocates ${ascendant} if you have the matching modifier on Forbidden Flesh`;
            }
        }

        return undefined;
    }

    isForbiddenFleshMod(zhMod: string): boolean {
        return ZH_FORBIDDEN_FLESH_MOD_REGEXP.test(zhMod);
    }

    translateForbiddenFleshMod(zhMod: string): string | undefined {
        const matches = ZH_FORBIDDEN_FLESH_MOD_REGEXP.exec(zhMod);
        if (matches !== null) {
            const zhAscendant = matches[1];
            const ascendant = this.passiveSkillService.translateAscendant(zhAscendant);
            if (ascendant !== undefined) {
                return `Allocates ${ascendant} if you have the matching modifier on Forbidden Flame`;
            }
        }
        return undefined;
    }

    dotranslateMod(stat: Stat, zhMod: string): string | undefined {
        if (zhMod === stat.zh) {
            return stat.en;
        }

        const zhTpl = new Template(stat.zh);
        const posParams = zhTpl.parseParams(zhMod);
        //does not match
        if (posParams === undefined) {
            return undefined;
        }

        const enTpl = new Template(stat.en);

        return enTpl.render(posParams);
    }

    public getMaxLineSizeOfCompoundedMod(firstLine: string): number {
        const body = StatUtil.getBodyOfZhModifier(firstLine);
        const entry = this.statProvider.providecompoundedStatsByFirstLinesZhBody(body);
        if (entry !== undefined) {
            return entry.maxLineSize;
        }

        return 0;
    }

    /**
     * Translate compounded mod for text item.
     * 
     * Caller should use `getMaxLineSizeOfCompoundedMod` before to get the max lines of candidates which has the first line.
     * 
     * The method uses the `lines` to infer a compounded mod, returns the translation.
     */
    public translateCompoundedMod(lines: string[]): { result: string, lineSize: number } | undefined {
        const body = StatUtil.getBodyOfZhModifier(lines[0]);
        const entry = this.statProvider.providecompoundedStatsByFirstLinesZhBody(body);
        if (entry === undefined) {
            return;
        }

        for (const compoundedStat of entry.stats) {
            const lineSize = compoundedStat.lineSize;
            if (compoundedStat.lineSize > lines.length) {
                continue;
            }
            const stat = compoundedStat.stat;
            const mod = lines.slice(0, lineSize).join(COMPOUNDED_STAT_LINE_SEPARATOR);

            if (StatUtil.getBodyOfZhTemplate(stat.zh) ===
                StatUtil.getBodyOfZhModifier(mod)) {
                const result = this.dotranslateMod(stat, mod);
                if (result !== undefined) {
                    return {
                        result: result,
                        lineSize: lineSize,
                    }
                }
            }
        }

        return undefined;
    }
}