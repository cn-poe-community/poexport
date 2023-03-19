import { GemProvider } from "../provider/gem.provider";

const QUALITY_TYPES = new Map([
    ["分歧", "Divergent"],
    ["异常", "Anomalous"],
    ["魅影", "Phantasmal"],
]);

const PROPERTY_NAMES = new Map([
    ["等级", "Level"],
    ["品质", "Quality"],
]);

export class GemService {
    private readonly gemProvider: GemProvider;
    constructor(gemProvider: GemProvider) {
        this.gemProvider = gemProvider;
    }

    public translateBaseType(zhBaseType: string): string | undefined {
        zhBaseType = zhBaseType.replace("(", "（").replace(")", "）");
        return this.gemProvider.provideSkills().get(zhBaseType);
    }

    public translateTypeLine(zhTypeLine: string): string | undefined {
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
        return skill !== undefined ? `${qualityTypePrefix}${skill}` : undefined;
    }

    public translatePropertyName(zhName: string): string | undefined {
        if (PROPERTY_NAMES.has(zhName)) {
            return PROPERTY_NAMES.get(zhName);
        }

        return undefined;
    }
}
