import { BaseTypeProvider } from "../provider/basetype.provider";
import { BaseType } from "../type/basetype.type";

const ZH_SUPERIOR_PREFIX = "精良的 ";
const SUPERIOR_PREFIX = "Superior ";
const ZH_SYNTHESISED_PREFIX = "忆境 ";
const SYNTHESISED_PREIFX = "Synthesised ";

export class BaseTypeService {
    constructor(private readonly baseTypeProvider: BaseTypeProvider) {}

    /**
     *
     * @param zhName item's zh name. There may be duplicate zh basetypes, uniques's zh name can help translating.
     */
    public getBaseTypeByZh(zh: string, zhName?: string): BaseType | undefined {
        const list = this.baseTypeProvider.provideBaseTypesByZh(zh);
        if (list === undefined) {
            return undefined;
        }

        if (list.length === 1 || zhName === undefined) {
            return list[0];
        }

        for (const b of list) {
            for (const unique of b.uniques) {
                if (unique.zh === zhName) {
                    return b;
                }
            }
        }
        return undefined;
    }

    /**
     * Infer the zh base type by zh base type line, and returns the matched BaseType.
     *
     * @param zhName item's zh name. There may be duplicate zh basetypes, uniques's zh name can help translating.
     */
    public getBaseTypeByZhTypeLine(
        zhTypeLine: string,
        zhName?: string
    ): { baseType: BaseType; zhBaseType: string } | undefined {
        if (zhTypeLine.startsWith(ZH_SUPERIOR_PREFIX)) {
            zhTypeLine = zhTypeLine.substring(ZH_SUPERIOR_PREFIX.length);
        }

        if (zhTypeLine.startsWith(ZH_SYNTHESISED_PREFIX)) {
            zhTypeLine = zhTypeLine.substring(ZH_SYNTHESISED_PREFIX.length);
        }

        //The zh type line without prefix may be a zh base type.
        const b = this.getBaseTypeByZh(zhTypeLine, zhName);
        if (b !== undefined) {
            return { baseType: b, zhBaseType: zhTypeLine };
        }

        //处理修饰词存在的情况:
        //如“显著的幼龙之大型星团珠宝”，其修饰词为：“显著的”、“幼龙之”，其zhBaseType为“大型星团珠宝”
        //
        //修饰词以`的`、`之`结尾，但`的`、`之`同时可能出现在zhBaseType中，如`潜能之戒`
        //以`的`、`之`为修饰词结尾，将baseType拆分为一个slices
        //
        //我们可以逐步去除修饰词，来检测剩余部分是否是一个zhBaseType.
        const pattern = /.+?[之的]/gu;
        if (pattern.test(zhTypeLine)) {
            //reset pattern status because we used `.test()` before
            pattern.lastIndex = 0;

            const len = zhTypeLine.length;
            let slices = [];
            let lastIndex = 0;
            while (lastIndex < len) {
                const matches = pattern.exec(zhTypeLine);
                if (matches) {
                    const result = matches[0];
                    slices.push(result);
                    lastIndex = pattern.lastIndex;
                } else {
                    if (lastIndex < len) {
                        slices.push(zhTypeLine.substring(lastIndex));
                    }
                    break;
                }
            }

            for (let i = slices.length; i > 0; i--) {
                const possible = slices.join();
                const b = this.getBaseTypeByZh(possible, zhName);
                if (b !== undefined) {
                    return { baseType: b, zhBaseType: possible };
                }
                slices = slices.slice(1);
            }
        }

        return undefined;
    }

    public translateBaseType(
        zhBaseType: string,
        zhName?: string
    ): string | undefined {
        const b = this.getBaseTypeByZh(zhBaseType, zhName);
        if (b !== undefined) {
            return b.en;
        }
        return undefined;
    }

    /**
     *
     * 一般情况下，物品的typeLine等价于baseType。魔法物品有所不同，其在baseType的基础上多了一堆修饰词前缀。
     * 修饰词的翻译很麻烦，且用处不大，这里选择去掉修饰词，仅保留baseType。
     *
     * 推荐使用baseType替换typeLine，只有在翻译文本格式的物品时，因为缺乏baseType，需要调用该方法。
     * @param zhTypeLine
     * @param zhName
     */
    public translateTypeLine(
        zhTypeLine: string,
        zhName?: string
    ): string | undefined {
        if (zhTypeLine.startsWith(ZH_SUPERIOR_PREFIX)) {
            const t = this.translateTypeLine(
                zhTypeLine.substring(ZH_SUPERIOR_PREFIX.length),
                zhName
            );
            if (t !== undefined) {
                return SUPERIOR_PREFIX + t;
            }
            return undefined;
        }

        if (zhTypeLine.startsWith(ZH_SYNTHESISED_PREFIX)) {
            const t = this.translateTypeLine(
                zhTypeLine.substring(ZH_SYNTHESISED_PREFIX.length),
                zhName
            );
            if (t !== undefined) {
                return SYNTHESISED_PREIFX + t;
            }
            return undefined;
        }

        const b = this.getBaseTypeByZhTypeLine(zhTypeLine, zhName);
        if (b !== undefined) {
            return b.baseType.en;
        }

        return undefined;
    }
}
