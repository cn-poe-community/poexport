import stats from "../asset/stats.json";
import { Language } from "../type/language.type";
import { Stat, StatMap } from "../type/stat.type";
import { StatUtil } from "../util/stat.util";

export class StatProvider {
    private readonly statIndexByZhBody = new Map<string, string>();

    constructor() {
        const statMap = stats as unknown as StatMap;
        for (const id in statMap) {
            const data = statMap[id];
            const zhTemplates = data.text[Language.Chinese];
            for (const key in zhTemplates) {
                const template = zhTemplates[key];
                const body = StatUtil.getBodyOfTemplate(template);
                if (this.statIndexByZhBody.has(body)) {
                    //console.log(`warning: repeated template body: ${body}`);
                    continue;
                }
                this.statIndexByZhBody.set(body, id);
            }
        }
    }

    public provideStatByZhBody(zhBody: string): Stat | null {
        let id = this.statIndexByZhBody.get(zhBody);
        if (id) {
            const statMap = stats as unknown as StatMap;
            return statMap[id];
        }

        return null;
    }
}