export class StatUtil {
    public static getBodyOfZhTemplate(template: string): string {
        return this.getNonAsciiOrPer(template);
    }

    public static getBodyOfZhModifier(mod: string): string {
        return this.getNonAsciiOrPer(mod);
    }

    private static getNonAsciiOrPer(str: string): string {
        const arr = new Uint16Array(str.length);
        let size = 0;

        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            if (char == 37 || char > 127) {
                arr[size++] = char;
            }
        }

        return Buffer.from(arr.buffer, 0, size * 2).toString("utf16le");
    }

    public static render(enTemplate: string, zhTemplate: string, zhMod: string): string {
        if (zhMod === zhTemplate) {
            return enTemplate;
        }

        const enTpl = new Template(enTemplate);
        const zhTpl = new Template(zhTemplate);

        return enTpl.render(zhTpl.parseParams(zhMod));
    }
}

/**
 * 
 * The template that can be pasered to segments and parameter index numbers.
 * 
 * Simple:
 * "Chain Hook has a {0}% chance to grant +1 Rage if it Hits Enemies"
 * 
 *   segments: ["Chain Hook has a ", "% chance to grant +1 Rage if it Hits Enemies"]
 *   parameter index numbers: [0]
 */
export class Template {
    origin: string;
    segments: string[];
    paramIndexNumbers: number[];//positional parameter numbers

    constructor(origin: string) {
        this.origin = origin;
        this.segments = [];
        this.paramIndexNumbers = [];

        let j = 0;
        let k = 0;
        let onParam = false;
        for (let i = 0; i < origin.length; i++) {
            const code = origin.charCodeAt(i);
            if (code === 123) {//"{"
                k = i;
                onParam = true;
            } else if (code === 125) {//"}"
                if (onParam) {
                    this.segments.push(origin.slice(j, k));
                    this.paramIndexNumbers.push(Number.parseInt(origin.slice(k + 1, i + 1)));
                    j = i + 1;
                    onParam = false;
                }
            } else {
                if (onParam) {
                    if (code < 48 || code > 57) {//out of "0"~"9"
                        onParam = false;
                    }
                }
            }
        }
        this.segments.push(origin.slice(j));
    }

    /**
     * Parse the modifer, return positional parameters.
     * @param modifier rendered template result with params
     * @returns map contains positions and parameters ; undefined if the modifer doesnot matches the template. 
     */
    public parseParams(modifier: string): Map<number, string> | undefined {
        const regStr = `^${this.segments.map(s => s.replace("+", "\\+")).join("(\\S+)")}$`;
        const execResult = new RegExp(regStr).exec(modifier);

        if (!execResult) {
            return;
        }

        const paramList = execResult.slice(1, this.paramIndexNumbers.length + 1);

        const paramMap = new Map<number, string>();
        for (const [i, num] of this.paramIndexNumbers.entries()) {
            paramMap.set(num, paramList[i]);
        }

        return paramMap;
    }

    /**
     * Render template by positional paramters.
     * @param params positional parameters
     * @returns result string
     */
    public render(params: Map<number, string>): string {
        const buf = new Array<string>(this.segments.length + this.paramIndexNumbers.length);
        let j = 0;
        for (let i = 0; i < this.paramIndexNumbers.length; i++) {
            buf[j++] = this.segments[i];
            buf[j++] = params.get(this.paramIndexNumbers[i]);
        }

        buf[j] = this.segments[this.segments.length - 1];

        return buf.join("");
    }
}