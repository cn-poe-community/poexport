import notables from "../asset/passiveskills/notables.json";
import keystones from "../asset/passiveskills/keystones.json";
import ascendant from "../asset/passiveskills/ascendant.json";
import { Language } from "../type/language.type";
import { Node, NodeMap } from "../type/passiveskill.type";

export class PassiveSkillProvider {
    private readonly notablesIndexByZhName = new Map<string, Node>();
    private readonly keystonesIndexByZhName = new Map<string, Node>();
    private readonly ascendantIndexByZhName = new Map<string, Node>();

    constructor() {
        const notableMap = notables as NodeMap;

        for (const id in notableMap) {
            const data = notableMap[id];
            //跳过具有重复中文名的天赋大点
            if (data.stats !== undefined) {
                continue;
            }
            const zhName = data["name"][Language.Chinese];
            this.notablesIndexByZhName.set(zhName, data);
        }

        const keystoneMap = keystones as NodeMap;
        for (const id in keystoneMap) {
            const data = keystoneMap[id];
            const zhName = data["name"][Language.Chinese];
            this.keystonesIndexByZhName.set(zhName, data);
        }

        const ascendantMap = ascendant as NodeMap;
        for (const id in ascendantMap) {
            const data = ascendantMap[id];
            const zhName = data["name"][Language.Chinese];
            this.ascendantIndexByZhName.set(zhName, data);
        }
    }

    public provideNotableByZhName(zhName: string): Node | null {
        const val = this.notablesIndexByZhName.get(zhName);
        if (val) {
            return val;
        }

        return null;
    }

    public provideKeystoneByZhName(zhName: string): Node | null {
        const val = this.keystonesIndexByZhName.get(zhName);
        if (val) {
            return val;
        }

        return null;
    }

    public provideAscendantByZhName(zhName: string): Node | null {
        const val = this.ascendantIndexByZhName.get(zhName);
        if (val) {
            return val;
        }

        return null;
    }
}