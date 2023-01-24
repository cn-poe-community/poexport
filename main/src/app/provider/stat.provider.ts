import stats from "../asset/stats.json";
import stats_mapping from "../asset/stats_mapping.json";
import { MappingEntry, Stat } from "../type/stat.type";
import { StatUtil } from "../util/stat.util";

export class StatProvider {
    private readonly statIndexByZhBody = new Map<string, Stat | Array<Stat>>();
    private readonly zhMappingIndexByBody = new Map<string, MappingEntry>();

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

        const mapping = stats_mapping as unknown as Array<MappingEntry>;
        for (const entry of mapping) {
            const body = StatUtil.getNonAsciiOrNonPer(entry.before);
            this.zhMappingIndexByBody.set(body, entry);
        }
    }

    public provideStatByZhBody(zhBody: string): Stat | Array<Stat> | null {
        const stat = this.statIndexByZhBody.get(zhBody);
        if (stat) {
            return stat;
        }

        return null;
    }

    public provideZhMappingEntryByBody(body: string): MappingEntry | null {
        const entry = this.zhMappingIndexByBody.get(body);
        if (entry) {
            return entry;
        }

        return null;
    }
}