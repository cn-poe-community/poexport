import { StatProvider } from "../provider/stat.provider";
import { Language } from "../type/language.type";
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
        const stat = this.statProvider.provideStatByZhBody(body);
        if (stat) {
            return this.doTranslate(stat, zhMod);
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
        if (matches){
            let zhAscendant = matches[1];
            let ascendant = this.passiveSkillService.translateAscendant(zhAscendant);
            if(ascendant){
                return `Allocates ${ascendant} if you have the matching modifier on Forbidden Flesh`;
            }
        }

        matches = ZhForbiddenFleshModRegExp.exec(zhMod);
        if (matches){
            let zhAscendant = matches[1];
            let ascendant = this.passiveSkillService.translateAscendant(zhAscendant);
            if(ascendant){
                return `Allocates ${ascendant} if you have the matching modifier on Forbidden Flame`;
            }
        }

        return undefined;
    }

    doTranslate(stat: Stat, zhMod: string): string | null {
        const zhTexts = stat.text[Language.Chinese];
        for(const key in zhTexts){
            const zhText = zhTexts[key];
            const r = new RegExp(zhText);
            let matches = r.exec(zhMod);

            if(matches){
                const text = stat.text[Language.English][key];
                return StatUtil.render(text,zhText,zhMod);
            }
        }

        return null;
    }
}