import stats from "../asset/stats.json";
import {
    Stat,
    CompoundedStatIndexEntry,
    COMPOUNDED_STAT_LINE_SEPARATOR,
} from "../type/stat.type";
import { StatUtil } from "../util/stat.util";

export class StatProvider {
    private readonly statsIndexedByZhBody = new Map<string, Stat[]>();
    private readonly compoundedStatsIndexedByFirstLinesZhBody = new Map<
        string,
        CompoundedStatIndexEntry
    >();

    constructor() {
        const statList = stats as unknown as Stat[];
        for (const stat of statList) {
            const zh = stat.zh;
            const body = StatUtil.getBodyOfZhTemplate(zh);
            if (this.statsIndexedByZhBody.has(body)) {
                const array = this.statsIndexedByZhBody.get(body);
                array.push(stat);
            } else {
                this.statsIndexedByZhBody.set(body, [stat]);
            }

            if (zh.includes(COMPOUNDED_STAT_LINE_SEPARATOR)) {
                const lines = zh.split(COMPOUNDED_STAT_LINE_SEPARATOR);
                const firstLine = lines[0];
                const firstLineBody = StatUtil.getBodyOfZhTemplate(firstLine);

                const value =
                    this.compoundedStatsIndexedByFirstLinesZhBody.get(
                        firstLineBody
                    );
                const compoundedStat = { lineSize: lines.length, stat: stat };
                if (value === undefined) {
                    this.compoundedStatsIndexedByFirstLinesZhBody.set(
                        firstLineBody,
                        { maxLineSize: lines.length, stats: [compoundedStat] }
                    );
                } else {
                    if (value.maxLineSize < lines.length) {
                        value.maxLineSize = lines.length;
                    }
                    value.stats.push(compoundedStat);
                }
            }
        }

        for (const value of this.compoundedStatsIndexedByFirstLinesZhBody.values()) {
            if (value.stats.length > 1) {
                value.stats.sort((a, b) => b.lineSize - a.lineSize); //max to min
            }
        }
    }

    public provideStatsByZhBody(zhBody: string): Stat[] | undefined {
        return this.statsIndexedByZhBody.get(zhBody);
    }

    public providecompoundedStatsByFirstLinesZhBody(
        body: string
    ): CompoundedStatIndexEntry | undefined {
        return this.compoundedStatsIndexedByFirstLinesZhBody.get(body);
    }
}
