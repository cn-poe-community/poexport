import { AttributeService } from "./service/attribute.service";
import { BaseTypeService } from "./service/basetype.service";
import { GemService } from "./service/gem.service";
import { ItemService } from "./service/item.service";
import { PropertyService } from "./service/property.service";
import { RequirementSerivce } from "./service/requirement.service";
import { StatService } from "./service/stat.service";
import { COMPOUNDED_STAT_LINE_SEPARATOR } from "./type/stat.type";

export class TextTranslator {
    readonly baseTypeService: BaseTypeService;
    readonly itemService: ItemService;
    readonly requirementService: RequirementSerivce;
    readonly propertySerivce: PropertyService;
    readonly gemService: GemService;
    readonly statService: StatService;
    readonly attributeService: AttributeService;

    constructor(baseTypeService: BaseTypeService,
        itemService: ItemService,
        requirementService: RequirementSerivce,
        propertySerivce: PropertyService,
        gemService: GemService,
        statService: StatService,
        attributeService: AttributeService) {
        this.baseTypeService = baseTypeService;
        this.itemService = itemService;
        this.requirementService = requirementService;
        this.propertySerivce = propertySerivce;
        this.gemService = gemService;
        this.statService = statService;
        this.attributeService = attributeService;
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
                const mod = this.lines.slice(i, Math.min(i + maxSize, this.lines.length));
                const translation = translator.statService
                    .translateCompoundedMod(mod
                        .map(line => line.modifier));
                if (translation) {
                    buf.push(this.fillSuffixsOfCompoundedModTranslation(mod, translation.result));
                    i += translation.lineSize;
                    continue;
                }
            }

            buf.push(line.getTranslation(ctx));
            i++;
        }

        return buf.join(LINE_SEPARATOR);
    }

    fillSuffixsOfCompoundedModTranslation(mod: Line[], translation: string): string {
        const slices = translation.split(COMPOUNDED_STAT_LINE_SEPARATOR);
        const buf = new Array<string>();

        for (let [i, slice] of slices.entries()) {
            if (mod[i].suffix) {
                buf.push(`${slice} ${mod[i].suffix}`);
            } else {
                buf.push(slice);
            }
        }

        return buf.join(COMPOUNDED_STAT_LINE_SEPARATOR);
    }
}

enum LineType {
    OnlyKey = 0,
    KeyValue,
    Modifier,
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
            let translation = translator.propertySerivce.translatePair(this.key, this.value);
            if (translation) {
                if (translation.name) {
                    this.key = translation.name;
                }

                if (translation.value) {
                    this.value = translation.value;
                }

                return `${this.key}${KEY_VALUE_SEPARATOR}${this.value}`;
            }

            const keyTranslation = translator.requirementService.translateName(this.key);
            if (keyTranslation) {
                this.key = keyTranslation;
                return `${this.key}${KEY_VALUE_SEPARATOR}${this.value}`;
            }

            translation = translator.attributeService.translatePair(this.key, this.value);

            if (translation) {
                if (translation.name) {
                    this.key = translation.name;
                }

                if (translation.value) {
                    this.value = translation.value;
                }
            }

            return `${this.key}${KEY_VALUE_SEPARATOR}${this.value}`;
        } else if (this.type === LineType.OnlyKey) {
            let translation = translator.propertySerivce.translateName(this.key);
            if (translation) {
                this.key = translation;
            }
            translation = translator.attributeService.translateName(this.key);
            if (translation) {
                this.key = translation;
            }

            return `${this.key}${KEY_VALUE_SEPARATOR}`;
        } else {
            const translation = translator.statService.translateMod(this.modifier);
            if (translation) {
                this.modifier = translation;
            } else {
                // Some lines are properties,attributes
                let translation = translator.propertySerivce.translateName(this.modifier);
                if (translation !== undefined) {
                    this.modifier = translation;
                }
                translation = translator.attributeService.translateName(this.modifier);
                if (translation !== undefined) {
                    this.modifier = translation;
                }
            }



            if (this.suffix) {
                return `${this.modifier} ${this.suffix}`;
            }

            return this.modifier;
        }
    }
}