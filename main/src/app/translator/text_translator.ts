import {
    ZH_CLASS_SCION,
    ZH_FORBIDDEN_FLAME,
    ZH_FORBIDDEN_FLESH,
    ZH_PASSIVESKILL_ASCENDANT_ASSASSIN,
    ZH_PASSIVESKILL_ASCENDANT_ASSASSIN_FIXED,
} from "./json_translator";
import { AttributeService } from "./service/attribute.service";
import { BaseTypeService } from "./service/basetype.service";
import { GemService } from "./service/gem.service";
import { ItemService } from "./service/item.service";
import { PropertyService } from "./service/property.service";
import { RequirementSerivce } from "./service/requirement.service";
import { StatService } from "./service/stat.service";
import { COMPOUNDED_STAT_LINE_SEPARATOR } from "./type/stat.type";

export class TextTranslator {
    constructor(
        readonly baseTypeService: BaseTypeService,
        readonly itemService: ItemService,
        readonly requirementService: RequirementSerivce,
        readonly propertySerivce: PropertyService,
        readonly gemService: GemService,
        readonly statService: StatService,
        readonly attributeService: AttributeService
    ) {}

    public translate(content: string): string {
        const item = new TextItem(this.fixContent(content));
        const ctx = new Context();
        ctx.translator = this;
        return item.getTranslation(ctx);
    }

    fixContent(content: string): string {
        if (
            content.includes(ZH_FORBIDDEN_FLESH) ||
            content.includes(ZH_FORBIDDEN_FLAME)
        ) {
            if (content.includes(ZH_CLASS_SCION)) {
                content = content.replace(
                    ZH_PASSIVESKILL_ASCENDANT_ASSASSIN,
                    ZH_PASSIVESKILL_ASCENDANT_ASSASSIN_FIXED
                );
            }
        }
        return content;
    }
}

class Context {
    translator: TextTranslator;
    item: TextItem;
    part: Part;
}

const PART_SEPARATOR = "\n--------\n";
const LINE_SEPARATOR = "\n";
const KEY_VALUE_SEPARATOR = ": ";

const ZH_ITEM_CLASS = "物品类别";

class TextItem {
    parts: Part[];

    constructor(content: string) {
        const partsContents = content.split(PART_SEPARATOR);

        this.parts = partsContents.map((partContent) => {
            if (partContent.startsWith(ZH_ITEM_CLASS)) {
                return new MetaPart(partContent);
            }
            return new Part(partContent);
        });
    }

    getTranslation(ctx: Context): string {
        ctx.item = this;
        return this.parts
            .map((part) => part.getTranslation(ctx))
            .join(PART_SEPARATOR);
    }
}

class Part {
    lines: Line[];

    constructor(content: string) {
        const linesContents = content.split(LINE_SEPARATOR);
        this.lines = linesContents.map((lineContent) => new Line(lineContent));
    }

    getTranslation(ctx: Context): string {
        ctx.part = this;
        const translator = ctx.translator;
        const buf = [];

        for (let i = 0; i < this.lines.length; ) {
            const line = this.lines[i];
            //复合词缀
            const maxSize =
                translator.statService.getMaxLineSizeOfCompoundedMod(
                    line.content
                );
            if (maxSize > 0) {
                const mod = this.lines.slice(
                    i,
                    Math.min(i + maxSize, this.lines.length)
                );
                const translation =
                    translator.statService.translateCompoundedMod(
                        mod.map((line) => line.modifier)
                    );
                if (translation) {
                    buf.push(
                        this.fillSuffixsOfCompoundedModTranslation(
                            mod,
                            translation.result
                        )
                    );
                    i += translation.lineSize;
                    continue;
                }
            }

            buf.push(line.getTranslation(ctx));
            i++;
        }

        return buf.join(LINE_SEPARATOR);
    }

    fillSuffixsOfCompoundedModTranslation(
        mod: Line[],
        translation: string
    ): string {
        const slices = translation.split(COMPOUNDED_STAT_LINE_SEPARATOR);
        const buf = new Array<string>();

        for (const [i, slice] of slices.entries()) {
            if (mod[i].suffix) {
                buf.push(`${slice} ${mod[i].suffix}`);
            } else {
                buf.push(slice);
            }
        }

        return buf.join(COMPOUNDED_STAT_LINE_SEPARATOR);
    }
}

class MetaPart extends Part {
    getTranslation(ctx: Context): string {
        ctx.part = this;
        const translator = ctx.translator;
        const buf = [];

        for (let i = 0; i < this.lines.length; i++) {
            const line = this.lines[i];
            //一般而言，倒数两行是name和typeLine
            //但是魔法物品有所不同，只有typeLine一行
            if (this.isNameLine(i)) {
                const zhName = line.content;
                const zhTypeLine = this.lines[this.lines.length - 1].content;
                const result =
                    translator.baseTypeService.getBaseTypeByZhTypeLine(
                        zhTypeLine,
                        zhName
                    );
                buf.push(
                    translator.itemService.translateName(
                        zhName,
                        result !== undefined ? result.zhBaseType : zhTypeLine
                    )
                );
            } else if (this.isTypeLine(i)) {
                const t = translator.baseTypeService.translateTypeLine(
                    line.content
                );
                buf.push(t !== undefined ? t : line.content);
            } else {
                buf.push(line.getTranslation(ctx));
            }
        }
        return buf.join(LINE_SEPARATOR);
    }

    isNameLine(lineNum: number): boolean {
        return (
            lineNum === this.lines.length - 2 &&
            this.lines[lineNum].type === LineType.MODIFIER
        );
    }

    isTypeLine(lineNum: number): boolean {
        return (
            lineNum === this.lines.length - 1 &&
            this.lines[lineNum].type === LineType.MODIFIER
        );
    }
}

enum LineType {
    ONLY_KEY = 0,
    KEY_VALUE,
    MODIFIER,
}

class Line {
    type: LineType;
    content: string;
    key?: string;
    value?: string;
    modifier: string;
    suffix: string;

    constructor(content: string) {
        this.content = content;
        if (content.includes(KEY_VALUE_SEPARATOR)) {
            const pair = content.split(KEY_VALUE_SEPARATOR);
            //may happen
            if (pair.length !== 2) {
                this.type = LineType.MODIFIER;
            } else {
                this.type = LineType.KEY_VALUE;
                this.key = pair[0];
                this.value = pair[1];
            }
        } else if (content.endsWith(":")) {
            this.type = LineType.ONLY_KEY;
            this.key = content.substring(0, content.length - 1);
        } else {
            this.type = LineType.MODIFIER;
            const pattern = new RegExp("(.+)\\s(\\(\\w+\\))$");
            const matchs = pattern.exec(content);
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
        if (this.type === LineType.KEY_VALUE) {
            let translation = translator.propertySerivce.translatePair(
                this.key,
                this.value
            );
            if (translation) {
                if (translation.name) {
                    this.key = translation.name;
                }

                if (translation.value) {
                    this.value = translation.value;
                }

                return `${this.key}${KEY_VALUE_SEPARATOR}${this.value}`;
            }

            const keyTranslation = translator.requirementService.translateName(
                this.key
            );
            if (keyTranslation) {
                const key = keyTranslation;
                const value = translator.requirementService.translateValue(
                    this.key,
                    this.value
                );
                return `${key ? key : this.key}${KEY_VALUE_SEPARATOR}${
                    value ? value : this.value
                }`;
            }

            translation = translator.attributeService.translatePair(
                this.key,
                this.value
            );

            if (translation) {
                if (translation.name) {
                    this.key = translation.name;
                }

                if (translation.value) {
                    this.value = translation.value;
                }
            }

            return `${this.key}${KEY_VALUE_SEPARATOR}${this.value}`;
        } else if (this.type === LineType.ONLY_KEY) {
            let translation = translator.propertySerivce.translateName(
                this.key
            );
            if (translation) {
                this.key = translation;
            }
            translation = translator.attributeService.translateName(this.key);
            if (translation) {
                this.key = translation;
            }

            return `${this.key}${KEY_VALUE_SEPARATOR}`;
        } else {
            const translation = translator.statService.translateMod(
                this.modifier
            );
            if (translation) {
                this.modifier = translation;
            } else {
                // Some lines are properties,attributes
                let translation = translator.propertySerivce.translateName(
                    this.modifier
                );
                if (translation !== undefined) {
                    this.modifier = translation;
                }
                translation = translator.attributeService.translateName(
                    this.modifier
                );
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
