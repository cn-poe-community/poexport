import stats from "../asset/stats.json";
import { Stat, CompoundedStatIndexEntry, COMPOUNDED_STAT_LINE_SEPARATOR, CompoundedStat } from "../type/stat.type";
import { StatUtil } from "../util/stat.util";

export class StatProvider {
    private readonly statIndexByZhBody = new Map<string, Stat | Array<Stat>>();
    private readonly compoundedStatIndexByFirstLinesZhBody = new Map<string, CompoundedStatIndexEntry>();

    constructor() {
        const statList = stats as unknown as Array<Stat>;
        for (const stat of statList) {
            const zh = stat.zh;
            const body = StatUtil.getBodyOfZhTemplate(zh);
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

            if (zh.includes(COMPOUNDED_STAT_LINE_SEPARATOR)) {
                const lines = zh.split(COMPOUNDED_STAT_LINE_SEPARATOR);
                const firstLine = lines[0];
                const firstLineBody = StatUtil.getBodyOfZhTemplate(firstLine);

                const value = this.compoundedStatIndexByFirstLinesZhBody.get(firstLineBody);
                const compoundedStat = { lineSize: lines.length, stat: stat };
                if (value === undefined) {
                    this.compoundedStatIndexByFirstLinesZhBody.set(firstLineBody, { maxLineSize: lines.length, stats: [compoundedStat] });
                } else {
                    if (value.maxLineSize < lines.length) {
                        value.maxLineSize = lines.length;
                    }
                    value.stats.push(compoundedStat);
                }
            }
        }

        for (const [_, value] of this.compoundedStatIndexByFirstLinesZhBody) {
            if (value.stats.length > 1) {
                value.stats.sort((a, b) => b.lineSize - a.lineSize);//max to min
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

    public providecompoundedStatByFirstLinesZhBody(body: string): CompoundedStatIndexEntry | undefined {
        return this.compoundedStatIndexByFirstLinesZhBody.get(body);
    }
}