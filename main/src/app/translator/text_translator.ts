import { BaseTypeService } from "./service/basetype.service";
import { GemService } from "./service/gem.service";
import { ItemService } from "./service/item.service";
import { PropertyService } from "./service/property.service";
import { RequirementSerivce } from "./service/requirement.service";
import { StatService } from "./service/stat.service";

export class TextTranslator {
    readonly baseTypeService: BaseTypeService;
    readonly itemService: ItemService;
    readonly requirementService: RequirementSerivce;
    readonly propertySerivce: PropertyService;
    readonly gemService: GemService;
    readonly statService: StatService;

    constructor(baseTypeService: BaseTypeService,
        itemService: ItemService,
        requirementService: RequirementSerivce,
        propertySerivce: PropertyService,
        gemService: GemService,
        statService: StatService) {
        this.baseTypeService = baseTypeService;
        this.itemService = itemService;
        this.requirementService = requirementService;
        this.propertySerivce = propertySerivce;
        this.gemService = gemService;
        this.statService = statService;
    }

    public translate(content: string): string {
        const item = new TextItem(content);
        const ctx = new Context();
        ctx.translator = this;
        return item.getTranslation(ctx);
    }
}

class Context {
    translator: TextTranslator;
    item: TextItem;
    part: Part;
}

const PART_SEPARATOR = "\n--------\n"; // 区域分隔符
const LINE_SEPARATOR = "\n"; // 行分隔符
const KEY_VALUE_SEPARATOR = ": "; // 键值分隔符

const ZH_ITEM_CLASS = "物品类别";

/**
 * 文本形式的物品
 */
class TextItem {
    parts: Part[];

    constructor(content: string) {
        let partsContents = content.split(PART_SEPARATOR);

        this.parts = partsContents.map(partContent => new Part(partContent));
    }

    getTranslation(ctx: Context): string {
        ctx.item = this;
        return this.parts.map(part => part.getTranslation(ctx)).join(PART_SEPARATOR);
    }
}

class Part {
    lines: Line[];

    constructor(content: String) {
        let linesContents = content.split(LINE_SEPARATOR);
        this.lines = linesContents.map(lineContent => new Line(lineContent));
    }

    getTranslation(ctx: Context): string {
        ctx.part = this;
        const translator = ctx.translator;
        let buf = [];

        let isMetaPart = false;
        let firstLine = this.lines[0];
        if (firstLine.type === LineType.KeyValue && firstLine.key === ZH_ITEM_CLASS) {
            isMetaPart = true;
        }

        for (let i = 0; i < this.lines.length;) {
            const line = this.lines[i];
            if (isMetaPart && line.type === LineType.Modifier) {
                //一般而言，倒数两行是name和typeLine
                //但是魔法物品有所不同，只有typeLine一行
                if (i === this.lines.length - 2) {
                    //name
                    const zhName = line.content;
                    const zhTypeLine = this.lines[this.lines.length - 1].content;
                    const baseType = translator.baseTypeService.getBaseTypeByZhTypeLine(zhTypeLine, zhName);
                    buf.push(translator.itemService.translateName(zhName, baseType.text[1]));
                    i++;
                    continue;
                } else if (i === this.lines.length - 1) {
                    //typeline
                    buf.push(translator.baseTypeService.translateTypeLine(line.content));
                    i++;
                    continue;
                }
            }

            //复合词缀
            const maxSize = translator.statService.getMaxLineSizeOfCompoundedMod(line.content);
            if (maxSize > 0) {
                const translation = translator.statService
                    .translateCompoundedMod(this.lines.slice(i, Math.min(i + maxSize, this.lines.length))
                        .map(line => line.content));
                if (translation) {
                    buf.push(translation.result);
                    i += translation.lineSize;
                    continue;
                }
            }

            buf.push(line.getTranslation(ctx));
            i++;
        }

        return buf.join(LINE_SEPARATOR);
    }
}

class Line {
    type: LineType;
    content: string;
    key: string | null;
    value: string | null;
    modifier: string;
    suffix: string;

    constructor(content: string) {
        this.content = content;
        if (content.includes(KEY_VALUE_SEPARATOR)) {
            const pair = content.split(KEY_VALUE_SEPARATOR);
            //may happen
            if (pair.length !== 2) {
                this.type = LineType.Modifier;
            } else {
                this.type = LineType.KeyValue;
                this.key = pair[0];
                this.value = pair[1];
            }
        } else if (content.endsWith(":")) {
            this.type = LineType.OnlyKey;
            this.key = content.substring(0, content.length - 1);
        } else {
            this.type = LineType.Modifier;
            let pattern = new RegExp("(.+)\\s(\\(\\w+\\))$");
            let matchs = pattern.exec(content);
            if (matchs) {
                this.modifier = matchs[1];
                this.suffix = matchs[2];
            } else {
                this.modifier = content;
            }
        }
    }

    getTranslation(ctx: Context): string {
        const translator = ctx.translator;
        if (this.type === LineType.KeyValue) {
            const translation = translator.propertySerivce.translate(this.key, this.value);
            if (translation) {
                if (translation.name) {
                    this.key = translation.name;
                }

                if (translation.value) {
                    this.value = translation.value;
                }
            } else {
                const keyTranslation = translator.requirementService.translateName(this.key);
                if (keyTranslation) {
                    this.key = keyTranslation;
                }
            }

            return `${this.key}${KEY_VALUE_SEPARATOR}${this.value}`;
        } else if (this.type === LineType.OnlyKey) {
            const translation = translator.propertySerivce.translate(this.key, null);
            if (translation) {
                this.key = translation.name;
            }

            return `${this.key}${KEY_VALUE_SEPARATOR}`;
        } else {
            const translation = translator.statService.translateMod(this.modifier);
            if (translation) {
                this.modifier = translation;
            } else {
                // 特殊词缀，如：弓，属于Property但比较特别，没有被翻译，放这里兜底
                // 以后可能有更清晰的处理方式
                const translation = translator.propertySerivce.translate(this.modifier, null);
                if (translation) {
                    this.modifier = translation.name;
                }
            }



            if (this.suffix) {
                return `${this.modifier} ${this.suffix}`;
            }

            return this.modifier;
        }
    }
}

enum LineType {
    OnlyKey = 0,
    KeyValue,
    Modifier,
}