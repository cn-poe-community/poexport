import stats from "../asset/stats.json";
import { Stat } from "../type/stat.type";
import { StatUtil } from "../util/stat.util";

export class StatProvider {
    private readonly statIndexByZhBody = new Map<string, Stat | Array<Stat>>();

    constructor() {
        const statList = stats as unknown as Array<Stat>;
        for (const stat of statList) {
            const body = StatUtil.getBodyOfZhTemplate(stat.zh);
            if (this.statIndexByZhBody.has(body)) {
                // console.log(`warning: repeated template body: ${body}`);
                const value = this.statIndexByZhBody.get(body);
                if (Array.isArray(value)) {
                    value.push(stat);
                } else {
                    const arr = [value, stat];
                    this.statIndexByZhBody.set(body, arr);
                }
            } else {
                this.statIndexByZhBody.set(body, stat);
            }
        }
    }

    public provideStatByZhBody(zhBody: string): Stat | Array<Stat> | null {
        const stat = this.statIndexByZhBody.get(zhBody);
        if (stat) {
            return stat;
        }

        return null;
    }
}