import { BaseTypeProvider } from "../provider/basetype.provider";
import { BaseType } from "../type/basetype.type";
import { Language } from "../type/language.type";

const ZH_SUPERIOR_PREFIX = "精良的 ";
const SUPERIOR_PREFIX = "Superior ";
const ZH_SYNTHESISED_PREFIX = "忆境 ";
const SYNTHESISED_PREIFX = "Synthesised ";

export class BaseTypeService {
    private readonly baseTypeProvider: BaseTypeProvider;

    constructor(baseTypeProvider: BaseTypeProvider) {
        this.baseTypeProvider = baseTypeProvider;
    }

    public getBaseTypeByZhText(zhBaseType: string, zhName?: string): BaseType | null {
        const list = this.baseTypeProvider.provideBaseTypeByZhText(zhBaseType);
        if (list.length === 0) {
            return null;
        }

        if (list.length === 1 || !zhName) {
            return list[0];
        }

        for (const b of list) {
            for (const uid in b.uniques) {
                const udata = b.uniques[uid];
                const uzhText = udata.text[Language.Chinese];
                if (uzhText === zhName) {
                    return b;
                }
            }
        }
        return null;
    }

    public getBaseTypeByZhTypeLine(zhTypeLine: string, zhName?: string): BaseType | null {
        if (zhTypeLine.startsWith(ZH_SUPERIOR_PREFIX)) {
            zhTypeLine = zhTypeLine.substring(ZH_SUPERIOR_PREFIX.length);
        }

        if (zhTypeLine.startsWith(ZH_SYNTHESISED_PREFIX)) {
            zhTypeLine = zhTypeLine.substring(ZH_SYNTHESISED_PREFIX.length)
        }

        const res = this.getBaseTypeByZhText(zhTypeLine);
        if (res) {
            return res;
        }

        //处理修饰词存在的情况：
        //如“显著的幼龙之大型星团珠宝”，其修饰词为：“显著的”、“幼龙之”，其zhBaseType为“大型星团珠宝”
        //
        //修饰词以`的`、`之`结尾，但`的`、`之`同时可能出现在zhBaseType中
        //以`的`、`之`为修饰词结尾，将baseType拆分为一个slices
        //
        //此时存在以下情况：
        // - slices[last]就是zhBaseType
        // - slices[last]是zhBaseType的末尾部分，需要补充其它slice来组成完整的zhBaseType

        const pattern = /.+?[之的]/ug;
        if (pattern.test(zhTypeLine)) {
            pattern.lastIndex = 0;

            const len = zhTypeLine.length;
            const slices = [];
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

            //zhTypeLine不包含“之”或“的”
            const last = slices[slices.length - 1];
            const res = this.getBaseTypeByZhText(last, zhName);
            if (res) {
                return res;
            }

            //baseType可能包含“之”或“的”

            //TODO：这里有一个假设，一个包含`之`或`的`的baseType不是另一个baseType的末尾部分
            // 这在大多数情况下都成立，但无法保证
            // 应当在数据库中检查是否存在这种可能性，并且在每次更新数据库后都进行检查

            let possible = last;
            for (let i = slices.length - 2; i > 0; i--) {
                possible = slices[i] + possible;
                const res = this.getBaseTypeByZhText(possible, zhName);
                if (res) {
                    return res;
                }
            }
        }

        return null;
    }

    public translateBaseType(zhBaseType: string, zhName?: string): string | null {
        const b = this.getBaseTypeByZhText(zhBaseType, zhName);
        if (b) {
            return b.text[Language.English];
        }
        return null;
    }

    /**
     * 获取typeLine。
     * 
     * 一般情况下，物品的typeLine等价于baseType。魔法物品有所不同，其在baseType的基础上多了一堆修饰词前缀。
     * 修饰词的翻译很麻烦，且用处不大，这里选择去掉修饰词，仅保留baseType。
     * 
     * 推荐使用baseType替换typeLine，只有在翻译文本格式的物品时，因为缺乏baseType，需要调用该方法。
     * @param zhTypeLine 
     * @param zhName 
     */
    public translateTypeLine(zhTypeLine: string, zhName?: string): string | null {
        if (zhTypeLine.startsWith(ZH_SUPERIOR_PREFIX)) {
            const res = this.translateTypeLine(zhTypeLine.substring(ZH_SUPERIOR_PREFIX.length), zhName);
            if (res) {
                return SUPERIOR_PREFIX + res;
            }
            return null;
        }

        if (zhTypeLine.startsWith(ZH_SYNTHESISED_PREFIX)) {
            const res = this.translateTypeLine(zhTypeLine.substring(ZH_SYNTHESISED_PREFIX.length), zhName);
            if (res) {
                return SYNTHESISED_PREIFX + res;
            }
            return null;
        }

        const b = this.getBaseTypeByZhTypeLine(zhTypeLine, zhName);
        if (b) {
            return b.text[Language.English];
        }

        return null;
    }
}