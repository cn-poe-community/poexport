import { GemProvider } from "../provider/gem.provider";

const QUALITY_TYPES = new Map([
    ["分歧", "Divergent"],
    ["异常", "Anomalous"],
    ["魅影", "Phantasmal"]
]);

const PROPERTY_NAMES = new Map([
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
        for (const [zh, en] of QUALITY_TYPES) {
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
        if (PROPERTY_NAMES.has(zhName)) {
            const res = PROPERTY_NAMES.get(zhName);
            if (res) {
                return res;
            }
        }

        return null;
    }
}