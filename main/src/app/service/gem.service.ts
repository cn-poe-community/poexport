import { GemProvider } from "../provider/gem.provider";

const qualityTypes = new Map([
    ["分歧", "Divergent"],
    ["异常", "Anomalous"],
    ["魅影", "Phantasmal"]
]);

const propertyNames = new Map([
    ["等级", "Level"],
    ["品质", "Quality"]
]);

export class GemService {
    private readonly gemProvider: GemProvider;
    constructor(gemProvider: GemProvider) {
        this.gemProvider = gemProvider;
    }

    public translateBaseType(zhBaseType: string): string | null {
        zhBaseType = zhBaseType.replace("(", "（").replace(")", "）");
        const res = this.gemProvider.provideSkills().get(zhBaseType);
        return res ? res : null;
    }

    public translateTypeLine(zhTypeLine: string): string | null {
        let qualityTypePrefix = "";
        let zhSkill = zhTypeLine;
        for (const [zh, en] of qualityTypes) {
            const zhQualityTypePrefix = `${zh} `;
            if (zhSkill.startsWith(zhQualityTypePrefix)) {
                qualityTypePrefix = `${en} `;
                zhSkill = zhTypeLine.substring(zhQualityTypePrefix.length);
                break;
            }
        }

        const skill = this.translateBaseType(zhSkill);
        return skill ? `${qualityTypePrefix}${skill}` : null;
    }

    public translatePropertyName(zhName: string): string | null {
        if (propertyNames.has(zhName)) {
            const res = propertyNames.get(zhName);
            if (res) {
                return res;
            }
        }

        return null;
    }
}